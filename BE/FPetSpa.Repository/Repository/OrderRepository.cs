using Amazon.Runtime.Internal.Auth;
using Amazon.S3.Model;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Services;
using FPetSpa.Repository.Services.PayPal;
using FPetSpa.Repository.Services.VnPay;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Globalization;
using System.Reflection.Metadata.Ecma335;

public class OrderRepository
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly FpetSpaContext _context;
    private readonly SendMailServices _sendMailServicers;
    private readonly IVnPayService _vnpayServices;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IPayPalService _paypalServices;
    private readonly IConfiguration _Iconfiguration;
    private const string RETURN_URL = "https://localhost:7055/api/Order/ResponeCheckOut";
    private const string CANCEL_URL = "https://localhost:7055/api/Order/Cancel";

    public OrderRepository(FpetSpaContext context, UserManager<ApplicationUser> userManager, SendMailServices sendMailServices, IVnPayService payService, IHttpContextAccessor httpContext, IPayPalService payPalService, IConfiguration configuration)
    {
        _userManager = userManager;
        _context = context;
        _sendMailServicers = sendMailServices;
        _vnpayServices = payService;
        _httpContextAccessor = httpContext;
        _paypalServices = payPalService;
        _Iconfiguration = configuration;
    }
    public async Task<int> GetOrderCount()
    {
        return await _context.Orders.CountAsync();
    }
    public async Task<(decimal, decimal)> GetRevenueForTwoMonthsAsync(DateTime month1, DateTime month2)
    {
        var revenueMonth1 = await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Month == month1.Month && o.RequiredDate.Value.Year == month1.Year)
            .SumAsync(o => o.Total ?? 0);

        var revenueMonth2 = await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Month == month2.Month && o.RequiredDate.Value.Year == month2.Year)
            .SumAsync(o => o.Total ?? 0);

        return (revenueMonth1, revenueMonth2);
    }

    public async Task<decimal> GetTotalRevenueAsync(DateTime? fromDate, DateTime? toDate)
    {
        var query = _context.Orders.AsQueryable();

        if (fromDate.HasValue)
        {
            query = query.Where(o => o.RequiredDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(o => o.RequiredDate <= toDate.Value);
        }

        return await query.SumAsync(o => o.Total ?? 0);
    }

    public async Task<string> StartCheckoutProduct(string customerId, string staffId, string Method)
    {
        var methodIn = _context.PaymentMethods.ToDictionary(p => p.MethodName, p => p.MethodId);
        var methodId = methodIn.TryGetValue(Method.ToUpper(), out var resultMethodId) ? resultMethodId : -1;
        if (resultMethodId == -1)
        {
            return null;
        }
        var user = await _userManager.FindByIdAsync(customerId);
        if (user != null)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.UserId == customerId);
            if (cart == null)
            {
                return null!;
            }
            string PaymentUrl = null!;
            string OrderIdTemp = GenerateNewOrderIdProductAsync();
            using (var transactionCheck = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    switch (Method.ToUpper())
                    {
                        case "VNPAY":
                            var exchangeRate = await new ConvertUSDtoVND().GetExchangeRateAsync();
                            double totalInVND = (Double)Math.Round(exchangeRate * cart.CartDetails.Sum(m => m.Quantity * m.Price).Value, 0, MidpointRounding.AwayFromZero);
                            var vnPayModel = new VnPayRequestModel
                            {
                                Description = user.FullName + " payment product for FPetSpa",
                                OrderId = OrderIdTemp + "_" + Guid.NewGuid().ToString(),
                                Amount = (Double)totalInVND,
                                CreatedDate = DateTime.Now,
                                ExpiredDate = DateTime.Now.AddSeconds(60),
                                ResponseUrl = $"{_Iconfiguration["VnPay:PaymentBackReturnUrl"]}?method=VNPAY&orderId={OrderIdTemp}"
                            };
                            PaymentUrl = _vnpayServices.CreatePaymentURl(vnPayModel, _httpContextAccessor.HttpContext);
                            break;
                        case "PAYPAL":
                            var paymentRequest = new PaymentRequest
                            {
                                intent = "sale",
                                payer = new Payer { payment_method = "paypal" },
                                transactions = new[]
                                {
                            new TransactionPayPal
                            {
                                description = "PayPal Method",
                                amount = new Amount{ currency = "USD", total = cart.CartDetails.Sum(c => c.Quantity * c.Price).Value.ToString(CultureInfo.InvariantCulture) },
                                item_list = new ItemList
                                {
                                    items = new[]
                                    {
                                         new Item
                                         {
                                            name = "Name Product",
                                            currency = "USD",
                                            price = "10.00",
                                            quantity = "1"
                                         }
                                    }
                                }

                            }
                        },
                                redirect_urls = new RedirectUrls
                                {
                                    return_url = RETURN_URL,
                                    cancel_url = CANCEL_URL
                                }


                            };
                            var paymentResponse = await _paypalServices.CreatePaymentAsync(paymentRequest);
                            PaymentUrl = paymentResponse.links.FirstOrDefault(link => link.rel == "approval_url")?.href;
                            break;
                        default:
                            return null;
                    }
                    var transaction = new FPetSpa.Repository.Data.Transaction
                    {
                        TransactionId = GenerateNewTransactionIDAsync(),
                        MethodId = methodId,
                        Status = (int)TransactionStatus.NOTPAID,
                        TransactionDate = DateOnly.FromDateTime(DateTime.Now)
                    };

                    Order orderTemp = new Order
                    {
                        OrderId = OrderIdTemp,
                        StaffId = staffId,
                        CustomerId = customerId,
                        Total = cart.CartDetails.Sum(cd => cd.Quantity * cd.Price),
                        ProductOrderDetails = cart.CartDetails.Select(cd => new ProductOrderDetail
                        {
                            OrderId = OrderIdTemp,
                            ProductId = cd.ProductId,
                            Quantity = cd.Quantity,
                            Price = cd.Price
                        }).ToList(),
                        TransactionId = transaction.TransactionId,
                        RequiredDate = DateTime.Now,
                        Status = (byte)OrderStatusEnum.Pending
                    };
                    Product product;
                    foreach (var item in orderTemp.ProductOrderDetails)
                    {
                        product = _context.Products.Find(item.ProductId)!;
                        if (product == null) { continue; }
                        product.ProductQuantity -= item.Quantity;
                        var tracker = _context.Products.Attach(product);
                        tracker.State = EntityState.Modified;
                        _context.SaveChanges();
                    }

                    _context.Transactions.Add(transaction);
                    _context.Orders.Add(orderTemp);
                    _context.Remove(cart);
                    await _context.SaveChangesAsync();
                    await _context.Database.CommitTransactionAsync();

                    return PaymentUrl;
                }
                catch (Exception e)
                {
                    await _context.Database.RollbackTransactionAsync();
                }
            }
        }
        return null;
    }
    public virtual async Task<Boolean> AfterCheckOutProduct(string orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        var transaction = await _context.Transactions.FindAsync(order.TransactionId);
        if (order != null && transaction != null)
        {
            if (transaction.Status == 0) return false;
            var user = await _userManager.FindByIdAsync(order.CustomerId!);
            var orderDetail = await _context.ProductOrderDetails.Where(p => p.OrderId == orderId).ToListAsync();
            if (user != null)
            {
                transaction.Status = (int)TransactionStatus.PAID;
                var tracker = _context.Transactions.Attach(transaction);
                tracker.State = EntityState.Modified;
                await _context.SaveChangesAsync();
                var productSendHtml = string.Join("<br>", orderDetail.Select(detail =>
                  $"Product Name: {_context.Products.Find(detail.ProductId)!.ProductName}, Quantity: {detail.Quantity}, Unit Price: {detail.Price}$"));
                await _sendMailServicers.SendEmailAsync(
                  user.Email,
                 "[CHECKOUT MAIL]",
                 $"<h3>Thank you {user.FullName} for buying our product, </h3> " +
                 "this is the information of order and transaction please double check for sure <3" +
                 $"<h5> ORDER: </h5>" +
                 $"Customer: {user.FullName} " + "<br></br>" +
                 $"Date: {order.RequiredDate} " + "<br></br>" +
                 $"Total: {order.Total}$" + "<br></br>" +
                 $"<b style='Font-size:20px;'> Product: </b>" + "<br></br>" +
                 $"{productSendHtml}" + "<br></br>" +
                 $"Trasaction Date: {transaction.TransactionDate} " + "<br></br>" +
                 "We hope you'll have a best day <3 <3 <3"
        );
                return true;
            }
        }
        return false;
    }

    public async Task<string> StartCheckoutServices(string ServicesId, string CustomerId, string PetId, string PaymentMethod, DateTime bookingDateTime)
    {
        const string staffID = "fee3ede4-5aa2-484b-bc12-7cdc4d9437ac";
        var methodIn = _context.PaymentMethods.ToDictionary(p => p.MethodName, p => p.MethodId);
        var methodId = methodIn.TryGetValue(PaymentMethod.ToUpper(), out var resultMethodId) ? resultMethodId : -1;
        if (resultMethodId == -1)
        {
            return null;
        }
        var user = await _userManager.FindByIdAsync(CustomerId);
        if (user != null)
        {
            if (ServicesId == null)
            {
                return null!;
            }
            if (PetId == null)
            {
                return null!;
            }
            var pet = await _context.Pets.FindAsync(PetId);
            var service = await _context.Services.FindAsync(ServicesId);
            var totalPriceInUSD = await CalculateServicePrice(service!, pet!.PetWeight);
            string PaymentUrl = null!;
            string OrderIdTemp = GenerateNewOrderIdServicesAsync();
            using (var transactionResult = await _context.Database.BeginTransactionAsync())
            {
                switch (PaymentMethod.ToUpper())
                {
                    case "VNPAY":
                        var exchangeRate = await new ConvertUSDtoVND().GetExchangeRateAsync();
                        double totalInVND = (Double)Math.Round(exchangeRate * totalPriceInUSD, 0, MidpointRounding.AwayFromZero);
                        var vnPayModel = new VnPayRequestModel
                        {
                            Description = user.FullName + " payment product for FPetSpa",
                            OrderId = OrderIdTemp + Guid.NewGuid().ToString(),
                            Amount = (Double)totalInVND,
                            CreatedDate = DateTime.Now,
                            ExpiredDate = DateTime.Now.AddSeconds(60),
                            ResponseUrl = $"{_Iconfiguration["VnPay:PaymentBackReturnUrl"]}?method=VNPAY&orderId={OrderIdTemp}"
                        };
                        PaymentUrl = _vnpayServices.CreatePaymentURl(vnPayModel, _httpContextAccessor.HttpContext);
                        break;
                    case "PAYPAL":
                        var paymentRequest = new PaymentRequest
                        {
                            intent = "sale",
                            payer = new Payer { payment_method = "paypal" },
                            transactions = new[]
                            {
                            new TransactionPayPal
                            {
                                description = "PayPal Method",
                                amount = new Amount{ currency = "USD", total = totalPriceInUSD.ToString(CultureInfo.InvariantCulture) },
                                item_list = new ItemList
                                {
                                    items = new[]
                                    {
                                         new Item
                                         {
                                            name = "Name Product",
                                            currency = "USD",
                                            price = "10.00",
                                            quantity = "1"
                                         }
                                    }
                                }

                            }
                        },
                            redirect_urls = new RedirectUrls
                            {
                                return_url = RETURN_URL,
                                cancel_url = CANCEL_URL
                            }


                        };
                        var paymentResponse = await _paypalServices.CreatePaymentAsync(paymentRequest);
                        PaymentUrl = paymentResponse.links.FirstOrDefault(link => link.rel == "approval_url")?.href;
                        break;
                    default:
                        return null;
                }
                var transaction = new FPetSpa.Repository.Data.Transaction
                {
                    TransactionId = GenerateNewTransactionIDAsync(),
                    MethodId = methodId,
                    Status = (int)TransactionStatus.NOTPAID,
                    TransactionDate = DateOnly.FromDateTime(DateTime.Now)
                };

                Order orderTemp = new Order
                {
                    OrderId = OrderIdTemp,
                    StaffId = staffID,
                    CustomerId = CustomerId,
                    Total = totalPriceInUSD,
                    TransactionId = transaction.TransactionId,
                    RequiredDate = bookingDateTime,
                    Status = (int)OrderStatusEnum.Pending
                };

                ServiceOrderDetail serviceOrderDetail = new ServiceOrderDetail
                {

                    ServiceId = service.ServiceId,
                    OrderId = OrderIdTemp,
                    PetId = PetId,
                    Discount = 0,
                    Price = totalPriceInUSD,
                    PetWeight = pet.PetWeight

                };

                _context.Transactions.Add(transaction);
                _context.Orders.Add(orderTemp);
                _context.ServiceOrderDetails.Add(serviceOrderDetail);
                await _context.SaveChangesAsync();
                await _context.Database.CommitTransactionAsync();
                return PaymentUrl;

            }
        }
        return null;
    }


    public virtual async Task<Boolean> AfterCheckOutService(string orderId)
    {
        Order order = await _context.Orders.FindAsync(orderId);
        ServiceOrderDetail serviceOrderDetail = _context.ServiceOrderDetails.FirstOrDefault(p => p.OrderId == orderId);
        Transaction transaction = await _context.Transactions.FindAsync(order.TransactionId);
        if (order != null && serviceOrderDetail != null && transaction != null)
        {
            if (transaction.Status == 0) return false;
            var user = await _userManager.FindByIdAsync(order.CustomerId);
            if (user != null)
            {
                var Pet = await _context.Pets.FindAsync(serviceOrderDetail.PetId);
                var Services = await _context.Services.FindAsync(serviceOrderDetail.ServiceId);

                transaction.Status = (int)TransactionStatus.PAID;
                var tracker = _context.Transactions.Attach(transaction);
                tracker.State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await _sendMailServicers.SendEmailAsync(
                    user.Email!,
                    "[CHECKOUT MAIL]",
                     $"<h3>Thank you {user.FullName} for using our services, </h3> " +
                     "This is the information of order and transaction please double check for sure <3" +
                     $"<p> ORDER: </p>" +
                    $"Customer: {user.FullName} " + "<br></br>" +
                    $"Pet: {Pet.PetName} " + "<br></br>" +
                    $"Services: {Services.ServiceName}" + "<br></br>" +
                     $"Date: {order.RequiredDate} " + "<br></br>" +
                     $"Total: {order.Total} " + "<br></br>" +
                     $"Note: Our Services price will depend on Pet weight:" + "<br></br>" +
                     $"Price will increace 20% from 10 - 20Kg," + "<br></br>" +
                     $"Price will increace 50% from 20 - 30Kg" + "<br></br>" +
                     $"Price will increace double upper than 30kg" + "<br></br>" +
                    $"Trasaction Date: {transaction.TransactionDate} " + "<br></br>" +
                     "We hope you'll have a best day <3 <3 <3");
                return true;
            }
        }
        return false!;
    }

    public virtual async Task<Boolean> AfterCheckOutServiceAddMoreProduct(string orderId)
    {
        Order order = await _context.Orders.FindAsync(orderId);
        Transaction transaction = await _context.Transactions.FindAsync(order.TransactionId);
        var orderDetail = await _context.ProductOrderDetails.Where(p => p.OrderId == orderId).ToListAsync();
        if (order != null && orderDetail != null && transaction != null)
        {
            var user = await _userManager.FindByIdAsync(order.CustomerId);
            if (user != null)
            {
                transaction.Status = (int)TransactionStatus.PAID;
                var tracker = _context.Transactions.Attach(transaction);
                tracker.State = EntityState.Modified;
                await _context.SaveChangesAsync();
                var productSendHtml = string.Join("<br>", orderDetail.Select(detail =>
   $"Product Name: {_context.Products.Find(detail.ProductId)!.ProductName}, Quantity: {detail.Quantity}, Unit Price: {detail.Price}$"));
                await _sendMailServicers.SendEmailAsync(
                  user.Email,
                 "[CHECKOUT MAIL]",
                 $"<h3>Thank you {user.FullName} for buying our product, </h3> " +
                 "this is the information of buying more product please double check it <3" +
                 $"<h5> ORDER: </h5>" +
                 $"Custumer: {user.FullName} " + "<br></br>" +
                 $"Date: {DateTime.Now} " + "<br></br>" +
                 $"Total: {order.Total}$" + "<br></br>" +
                 $"<b style='Font-size:20px;'> Product: </b>" + "<br></br>" +
                 $"{productSendHtml}" + "<br></br>" +
                 $"Trasaction Date: {transaction.TransactionDate} " + "<br></br>" +
                 "We hope you'll have a best day <3 <3 <3");
                return true;
            }
        }
        return false!;
    }


    public async Task<decimal> CalculateServicePrice(Service service, decimal? petWeight)
    {
        decimal basePrice = service.Price ?? 0m;
        decimal priceFactor = 1.0m;

        if (petWeight <= 10)
        {
            priceFactor = 1.0m;
        }
        else if (petWeight > 10 && petWeight <= 20)
        {
            priceFactor = 1.2m; // Tăng giá 20% cho trọng lượng từ 10-20kg
        }
        else if (petWeight > 20 && petWeight <= 30)
        {
            priceFactor = 1.5m; // Tăng giá 50% cho trọng lượng từ 20-30kg
        }
        else
        {
            priceFactor = 2.0m; // Giá gấp đôi cho trọng lượng trên 30kg
        }

        decimal finalPrice = basePrice * priceFactor;
        return finalPrice;
    }




    public string GenerateNewOrderIdProductAsync()
    {
        var lastProduct = (_context.Orders.ToList()).Where(c => c.OrderId.Substring(0, 3).Equals("ORP"))
                                  .OrderByDescending(p => int.Parse(p.OrderId.Substring(3))) // Sắp xếp theo giá trị số của ProductId
                                  .FirstOrDefault();
        int newIdNumber = 1;
        if (lastProduct != null)
        {
            string lastId = lastProduct.OrderId;
            if (lastId.StartsWith("ORP"))
            {
                string numberPart = lastId.Substring(3); // Bỏ phần "PRO"
                if (int.TryParse(numberPart, out int lastNumber))
                {
                    newIdNumber = lastNumber + 1;
                }
            }
        }

        return $"ORP{newIdNumber}";
    }

    public string GenerateNewOrderIdServicesAsync()
    {
        var lastProduct = (_context.Orders.ToList()).Where(c => c.OrderId.Substring(0, 3).Equals("ORS"))
                                  .OrderByDescending(p => int.Parse(p.OrderId.Substring(3))) // Sắp xếp theo giá trị số của ProductId
                                  .FirstOrDefault();
        int newIdNumber = 1;
        if (lastProduct != null)
        {
            string lastId = lastProduct.OrderId;
            if (lastId.StartsWith("ORS"))
            {
                string numberPart = lastId.Substring(3); // Bỏ phần "PRO"
                if (int.TryParse(numberPart, out int lastNumber))
                {
                    newIdNumber = lastNumber + 1;
                }
            }
        }

        return $"ORS{newIdNumber}";
    }


    public string GenerateNewTransactionIDAsync()
    {

        var lastService = _context.Transactions.ToList()
                   .OrderByDescending(p => Int32.Parse(p.TransactionId.Substring(3))) // Sắp xếp theo phần số
                   .FirstOrDefault();
        int newIdNumber = 1;
        if (lastService != null)
        {
            string lastId = lastService.TransactionId;
            if (lastId.StartsWith("TRS"))
            {
                string numberPart = lastId.Substring(3); // Bỏ phần "PRO"
                if (int.TryParse(numberPart, out int lastNumber))
                {
                    newIdNumber = lastNumber + 1;
                }
            }
        }

        return $"TRS{newIdNumber}";
    }

    public async Task<Boolean> AddOneProductToServiceBooking(string orderid, string productid, int quantity, double discound)
    {
        Order order = await _context.Orders.FindAsync(orderid);
        Product product = await _context.Products.FindAsync(productid);

        if (order == null) return false;
        _context.ProductOrderDetails.Add(new ProductOrderDetail
        {
            OrderId = order.OrderId,
            ProductId = productid,
            Quantity = quantity,
            Price = product.Price * quantity,
            Discount = discound
        });
        order.Total += (product.Price * quantity);
        var tracker = _context.Orders.Attach(order);
        tracker.State = EntityState.Modified;
        _context.SaveChanges();
        return true;
    }


    public async Task<string> AddManyProductToServiceBooking(string orderid, List<ProductDetailRequestAddMore> productDetails)
    {
        Order order = await _context.Orders.FindAsync(orderid!)!;
        if (order == null) return null!;
        if(productDetails.IsNullOrEmpty()) return null!;
        decimal totalPriceInUSD = 0;
        foreach (var item in productDetails)
        {
            Product product = await _context.Products.FindAsync(item.ProductId);
            if(product == null) continue;
            _context.ProductOrderDetails.Add(new ProductOrderDetail
            {
                OrderId = order.OrderId,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = product.Price * item.Quantity,
                Discount = item.Discount
            });
            totalPriceInUSD += (product.Price.Value * item.Quantity);
            order.Total += (product.Price.Value * item.Quantity);
        }
        var user = await _userManager.FindByIdAsync(order.CustomerId!);
        string PaymentUrl = null;
        var transaction = await _context.Transactions.FindAsync(order.TransactionId);
        string PaymentMethod = _context.PaymentMethods.FindAsync(transaction.MethodId).Result.MethodName!;
        using (var transactionResult = await _context.Database.BeginTransactionAsync())
        {
            switch (PaymentMethod.ToUpper())
            {
                case "VNPAY":
                    var exchangeRate = await new ConvertUSDtoVND().GetExchangeRateAsync();
                    double totalInVND = (Double)Math.Round(exchangeRate * totalPriceInUSD, 0, MidpointRounding.AwayFromZero);
                    var vnPayModel = new VnPayRequestModel
                    {
                        Description = user.FullName + " payment product for FPetSpa",
                        OrderId = orderid + Guid.NewGuid().ToString(),
                        Amount = (Double)totalInVND,
                        CreatedDate = DateTime.Now,
                        ExpiredDate = DateTime.Now.AddSeconds(60),
                        ResponseUrl = $"{_Iconfiguration["VnPay:PaymentBackReturnUrl"]}?method=VNPAY&orderId={orderid}"
                    };
                    PaymentUrl = _vnpayServices.CreatePaymentURl(vnPayModel, _httpContextAccessor.HttpContext);
                    break;
                case "PAYPAL":
                    var paymentRequest = new PaymentRequest
                    {
                        intent = "sale",
                        payer = new Payer { payment_method = "paypal" },
                        transactions = new[]
                        {
                            new TransactionPayPal
                            {
                                description = "PayPal Method",
                                amount = new Amount{ currency = "USD", total = totalPriceInUSD.ToString(CultureInfo.InvariantCulture) },
                                item_list = new ItemList
                                {
                                    items = new[]
                                    {
                                         new Item
                                         {
                                            name = "Name Product",
                                            currency = "USD",
                                            price = "10.00",
                                            quantity = "1"
                                         }
                                    }
                                }

                            }
                        },
                        redirect_urls = new RedirectUrls
                        {
                            return_url = RETURN_URL,
                            cancel_url = CANCEL_URL
                        }


                    };
                    var paymentResponse = await _paypalServices.CreatePaymentAsync(paymentRequest);
                    PaymentUrl = paymentResponse.links.FirstOrDefault(link => link.rel == "approval_url")?.href;
                    break;
                default:
                    return null;
            }
            var tracker = _context.Orders.Attach(order);
            tracker.State = EntityState.Modified;
            _context.SaveChanges();
            return PaymentUrl!;
        }
    }

    public async Task<Boolean> DeleteOrderByOrderId(string orderId)
    {
        var result = _context.Orders.Include(x => x.ProductOrderDetails).FirstOrDefault(x => x.OrderId == orderId);
       // Order order = _context.Orders.Find(orderId);
        if (result == null) return false;
        if (orderId.StartsWith("ORP") && result != null)
        {
            _context.ProductOrderDetails.RemoveRange(result.ProductOrderDetails);
            _context.Remove(result);
            _context.SaveChanges();
            return true;
        }
        else if (orderId.StartsWith("ORS"))
        {
            var OrderSer = _context.ServiceOrderDetails.FirstOrDefault(x => x.OrderId == orderId);
            if (OrderSer != null)
            {
                _context.ServiceOrderDetails.Remove(OrderSer);
                if (result!.ProductOrderDetails != null)
                { 
                    _context.ProductOrderDetails.RemoveRange(result!.ProductOrderDetails);
                    _context.Remove(result);
                    _context.SaveChanges();
                    return true;
                }
                _context.Orders.Remove(result);
                _context.SaveChanges();
            }
        }
        return false;
    }

    public async Task<string> ReOrder(string OrderId)
    {
        Order order = _context.Orders.Find(OrderId);
        if (order == null) return null;
        var user = await _userManager.FindByIdAsync(order.CustomerId!);
        if (user != null)
        {
            Transaction transaction = _context.Transactions.Find(order.TransactionId)!;
            if (transaction != null)
            {
                if (transaction.Status == (int)TransactionStatus.PAID) return null;
                string Method = _context.PaymentMethods.Find(transaction.MethodId)!.MethodName!;
                string PaymentUrl = null!;
                using (var transactionCheck = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        switch (Method.ToUpper())
                        {
                            case "VNPAY":
                                var exchangeRate = await new ConvertUSDtoVND().GetExchangeRateAsync();
                                double totalInVND = (Double)Math.Round(exchangeRate * order.Total!.Value, 0, MidpointRounding.AwayFromZero);
                                var vnPayModel = new VnPayRequestModel
                                {
                                    Description = user.FullName + " payment product for FPetSpa",
                                    OrderId = order.OrderId + "_" + Guid.NewGuid().ToString(),
                                    Amount = (Double)totalInVND,
                                    CreatedDate = DateTime.Now,
                                    ExpiredDate = DateTime.Now.AddSeconds(60),
                                    ResponseUrl = $"{_Iconfiguration["VnPay:PaymentBackReturnUrl"]}?method=VNPAY&orderId={order.OrderId}"
                                };
                                PaymentUrl = _vnpayServices.CreatePaymentURl(vnPayModel, _httpContextAccessor.HttpContext);
                                break;
                            case "PAYPAL":
                                var paymentRequest = new PaymentRequest
                                {
                                    intent = "sale",
                                    payer = new Payer { payment_method = "paypal" },
                                    transactions = new[]
                                    {
                            new TransactionPayPal
                            {
                                description = "PayPal Method",
                                amount = new Amount{ currency = "USD", total = order.Total!.Value.ToString(CultureInfo.InvariantCulture) },
                                item_list = new ItemList
                                {
                                    items = new[]
                                    {
                                         new Item
                                         {
                                            name = "Name Product",
                                            currency = "USD",
                                            price = "10.00",
                                            quantity = "1"
                                         }
                                    }
                                }

                            }
                        },
                                    redirect_urls = new RedirectUrls
                                    {
                                        return_url = RETURN_URL,
                                        cancel_url = CANCEL_URL
                                    }


                                };
                                var paymentResponse = await _paypalServices.CreatePaymentAsync(paymentRequest);
                                PaymentUrl = paymentResponse.links.FirstOrDefault(link => link.rel == "approval_url")?.href;
                                break;
                            default:
                                return null;
                        }
                        await _context.Database.CommitTransactionAsync();

                        return PaymentUrl;
                    }
                    catch (Exception e)
                    {
                        await _context.Database.RollbackTransactionAsync();
                    }
                }
            }
        }
        return null;
    }

}






