using Amazon.Runtime.Internal.Auth;
using Amazon.S3.Model;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Services;
using FPetSpa.Repository.Services.PayPal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QRCoder;
using System.Globalization;
using System.Drawing;
using System;
using System.IO;
using System.Drawing.Imaging;
using MailKit.Search;
using FPetSpa.Repository.Model.PayPalModel;
using PayPal.Api;
using Org.BouncyCastle.Tls.Crypto.Impl.BC;
using FPetSpa.Repository.Model.OrderModel;
public class OrderRepository
{
    private readonly ImageService _image;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly FpetSpaContext _context;
    private readonly SendMailServices _sendMailServicers;
    private readonly IVnPayService _vnpayServices;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IPayPalService _paypalServices;
    private readonly IConfiguration _Iconfiguration;
    private const string RETURN_URL = "https://fpetspa.azurewebsites.net/api/Order/ResponeCheckOut";
    private const string CANCEL_URL = "https://localhost:7055/api/Order/Cancel";
    private const string HOMEPAGE = "http://localhost:5173/";

    public OrderRepository(FpetSpaContext context, UserManager<ApplicationUser> userManager, ImageService imageService, SendMailServices sendMailServices, IVnPayService payService, IHttpContextAccessor httpContext, IPayPalService payPalService, IConfiguration configuration)
    {
        _image = imageService;
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
    public async Task<bool> UpdateOrder(FPetSpa.Repository.Data.Order order)
    {
        var existingOrder = await _context.Orders.FindAsync(order.OrderId);
        if (existingOrder == null)
        {
            return false; // Đơn hàng không tồn tại
        }

        // Cập nhật các thuộc tính của đơn hàng
        existingOrder.CustomerId = order.CustomerId;
        existingOrder.StaffId = order.StaffId;
        existingOrder.RequiredDate = order.RequiredDate;
        existingOrder.Total = order.Total;
        existingOrder.VoucherId = order.VoucherId;
        existingOrder.TransactionId = order.TransactionId;
        existingOrder.DeliveryOption = order.DeliveryOption;
        existingOrder.Status = order.Status;

        // Cập nhật đơn hàng trong cơ sở dữ liệu
        _context.Orders.Update(existingOrder);
        await _context.SaveChangesAsync(); // Lưu thay đổi

        return true; // Cập nhật thành công
    }
    public async Task<decimal> CompareOrdersForTwoMonthsAsync(int year1, int month1, int year2, int month2)
    {
        // Xác định khoảng thời gian của tháng thứ nhất
        var startOfMonth1 = new DateTime(year1, month1, 1);
        var endOfMonth1 = startOfMonth1.AddMonths(1).AddDays(-1);

        // Xác định khoảng thời gian của tháng thứ hai
        var startOfMonth2 = new DateTime(year2, month2, 1);
        var endOfMonth2 = startOfMonth2.AddMonths(1).AddDays(-1);

        // Tổng số đơn hàng của tháng thứ nhất
        var ordersMonth1 = await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Date >= startOfMonth1 && o.RequiredDate.Value.Date <= endOfMonth1)
            .CountAsync();

        // Tổng số đơn hàng của tháng thứ hai
        var ordersMonth2 = await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Date >= startOfMonth2 && o.RequiredDate.Value.Date <= endOfMonth2)
            .CountAsync();

        // Tính toán phần trăm thay đổi
        return CalculatePercentageChange(ordersMonth1, ordersMonth2);
    }

    private decimal CalculatePercentageChange(int oldTotal, int newTotal)
    {
        if (oldTotal == 0)
        {
            return newTotal == 0 ? 0 : 100;
        }
        return ((decimal)(newTotal - oldTotal) / oldTotal) * 100;
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

    public async Task<List<OrderResponse>> GetOrderStatsByDateRange(DateTime startDate, DateTime endDate)
    {
        try
        {
            var orders = await _context.Orders
                .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Date >= startDate.Date && o.RequiredDate.Value.Date <= endDate.Date)
                .Include(o => o.ProductOrderDetails)
                .ToListAsync();

            var groupedOrders = orders.GroupBy(o => o.RequiredDate.Value.Date)
                .Select(g => new OrderResponse
                {
                    Date = g.Key.ToString("dd/MM/yyyy"),
                    OrderCount = g.Count(),
                    ProductCount = g.Sum(o => o.ProductOrderDetails.Sum(pod => pod.Quantity ?? 0)),
                    TotalAmount = (decimal)g.Sum(o => o.Total)
                })
                .ToList();

            return groupedOrders;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetOrderStatsByDateRange: {ex.Message}");
            return new List<OrderResponse>();
        }
    }





    public async Task<int> GetOrderCountByMonth(int year, int month)
    {
        return await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Year == year && o.RequiredDate.Value.Month == month)
            .CountAsync();
    }


    public async Task<int> GetOrderCountByYear(int year)
    {
        return await _context.Orders
            .Where(o => o.RequiredDate.Value.Year == year)
            .CountAsync();
    }

    public async Task<Boolean> StartCheckoutProduct(string customerId, string staffId, string method, string? voucherCode = null, string? DeliveryOption = null, decimal? ShippingCost = null)
    {
        var methodIn = _context.PaymentMethods.ToDictionary(p => p.MethodName, p => p.MethodId);
        var methodId = methodIn.TryGetValue(method.ToUpper(), out var resultMethodId) ? resultMethodId : -1;
        if (methodId == -1)
        {
            return false;
        }
        if (DeliveryOption.ToUpper().Equals("SHIPPING") || DeliveryOption.ToUpper().Equals("PICKUP"))
        {
            if (DeliveryOption.ToUpper().Equals("SHIPPING")) DeliveryOption = "SHIPPING";
            else DeliveryOption = "PICKUP";

            var user = await _userManager.FindByIdAsync(customerId);
            if (user != null)
            {
                var cart = await _context.Carts
                    .Include(c => c.CartDetails)
                    .FirstOrDefaultAsync(c => c.UserId == customerId);
                if (cart == null)
                {
                    return false!;
                }
                // Voucher validation and application
                Voucher? voucher = null;
                double discountPercentage = 0;
                if (!string.IsNullOrEmpty(voucherCode))
                {
                    voucher = await _context.Vouchers
                        .FirstOrDefaultAsync(v => v.VoucherId == voucherCode &&
                                                  v.StartDate <= DateOnly.FromDateTime(DateTime.Now) &&
                                                  v.EndDate >= DateOnly.FromDateTime(DateTime.Now));
                    if (voucher == null)
                    {
                        return false; // Invalid voucher
                    }
                    // Parse the discount percentage
                    if (!double.TryParse(voucher.Description, out discountPercentage))
                    {
                        discountPercentage = 0; // Default to 0 if parsing fails
                    }
                }
                string orderIdTemp = GenerateNewOrderIdProductAsync();
                var transaction = new FPetSpa.Repository.Data.Transaction
                {
                    TransactionId = GenerateNewTransactionIDAsync(),
                    MethodId = methodId,
                    Status = (int)TransactionStatus.NOTPAID,
                    TransactionDate = DateOnly.FromDateTime(DateTime.Now)
                };

                var orderTemp = new FPetSpa.Repository.Data.Order
                {
                    OrderId = orderIdTemp,
                    StaffId = staffId,
                    CustomerId = customerId,
                    Total = cart.CartDetails.Sum(cd => cd.Quantity * cd.Price),
                    ProductOrderDetails = cart.CartDetails.Select(cd => new ProductOrderDetail
                    {
                        OrderId = orderIdTemp,
                        ProductId = cd.ProductId,
                        Quantity = cd.Quantity,
                        Price = cd.Price
                    }).ToList(),
                    TransactionId = transaction.TransactionId,
                    RequiredDate = DateTime.Now,
                    Status = (byte)OrderProductStatusEnum.Pending,
                    VoucherId = voucher?.VoucherId,
                    DeliveryOption = DeliveryOption
                };
                //Apply the voucher discount
                if (discountPercentage > 0)
                {
                    orderTemp.Total = Decimal.Multiply((decimal)orderTemp.Total, Decimal.Subtract(1, (decimal)discountPercentage));
                    // Apply voucher discount
                }
                if (ShippingCost != null) orderTemp.Total += ShippingCost;
                foreach (var item in orderTemp.ProductOrderDetails)
                {
                    var product = _context.Products.Find(item.ProductId)!;
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
                return true;
            }
        }
        return false;
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
                var productSendHtml = orderDetail.Select(product => $@"
            <tr>
                <td valign=""top"">
                    <!--[if mso | IE]>
                    <table style=""width: 100%;"">
                        <tr>
                    <![endif]-->
                    <!--[if mso | IE]>
                    <td valign=""top"">
                        <table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"">
                            <tr>
                                <td style=""vertical-align:top;"">
                    <![endif]-->
                    <div style=""display: inline-block; vertical-align: top;"" class=""product-box-col"">
                        <table style=""width:100%"">
                            <tbody>
                                <tr>
                                    <td style=""width:200px;padding: 0 30px 0 24px;"" align=""left"" class=""gr-image-container product-box-col"">
                                        <img src=""{_image.GetLinkByName("productfpetspa", _context.Products.Find(product.ProductId)!.PictureName!).Result}"" alt=""{product.ProductId}"" style=""border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;"" width=""200"" height=""auto"" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <![endif]-->
                    <!--[if mso | IE]>
                    </td></tr></table></td>
                    <![endif]-->
                    <div style=""display: inline-block; width: 316px; vertical-align: top;"" class=""product-box-col"">
                        <table style=""width:100%"">
                            <tbody>
                                <tr>
                                    <td valign=""top"">
                                        <table style=""width: 100%;"">
                                            <tbody>
                                                <tr>
                                                    <td style=""line-height: normal;font-family: Arial;font-size: 16px;color: #1F262F;font-weight: bold;text-decoration: initial;font-style: initial;padding: 20px 0 8px 0;"" align=""left"" class=""product-box-col-text"">
                                                        {_context.Products.Find(product.ProductId)!.ProductName}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""line-height: normal;font-family: Arial;font-size: 14px;color: #4D5C70;font-weight: initial;text-decoration: initial;font-style: initial;padding: 0 30px 16px 0;"" align=""left"" class=""product-box-col-text"">
                                                        {product.Quantity}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""line-height: normal;font-family: Arial;font-size: 24px;color: #000000;font-weight: bold;text-decoration: initial;font-style: initial;padding: 0 0 10px 0;"" align=""left"" class=""product-box-col-text"">
                                                        {product.Price:C}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""padding: 27px 0 20px 0;; width:100%"" align=""left"" class=""product-box-col-text"">
                                                        <div style=""display: inline-block"">
                                                            <table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;"">
                                                                <tbody>
                                                                    <tr></tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        ").ToList();
                var productSendHtmlRe = string.Join("", productSendHtml);
                var bodyHtml = this.BodySendMailProduct(productSendHtmlRe, user);
                if(order.DeliveryOption!.ToUpper().Equals("PICKUP"))
                {
                    bodyHtml = this.BodySendMailProductPickUp(productSendHtmlRe, user);
                    byte[] qrCodeBase64 = GenerateQRCode($"{orderId}");
                    await _sendMailServicers.SendEmailWithQRCodeAsync(
                        user.Email!,
                        "[CHECKOUT MAIL]",
                        bodyHtml,
                        qrCodeBase64
                        );
                    return true;
                }
                await _sendMailServicers.SendEmailAsync(
                  user.Email!,
                 "[CHECKOUT MAIL]",
                 bodyHtml);
                return true;
            }
        }
        return false;
    }
    public async Task<Boolean> StartCheckoutServices(string ServicesId, string CustomerId, string PetId, string PaymentMethod, DateTime bookingDateTime, string? voucherCode = null)
    {
        const string staffID = "fee3ede4-5aa2-484b-bc12-7cdc4d9437ac";
        var methodIn = _context.PaymentMethods.ToDictionary(p => p.MethodName, p => p.MethodId);
        var methodId = methodIn.TryGetValue(PaymentMethod.ToUpper(), out var resultMethodId) ? resultMethodId : -1;
        if (resultMethodId == -1)
        {
            return false;
        }
        var user = await _userManager.FindByIdAsync(CustomerId);
        if (user != null)
        {
            if (ServicesId == null)
            {
                return false;
            }
            if (PetId == null)
            {
                return false;
            }
            var pet = await _context.Pets.FindAsync(PetId);
            var service = await _context.Services.FindAsync(ServicesId);
            var totalPriceInUSD = await CalculateServicePrice(service!, pet!.PetWeight);

            // Voucher validation and application
            Voucher? voucher = null;
            double discountPercentage = 0;
            if (!string.IsNullOrEmpty(voucherCode))
            {
                voucher = await _context.Vouchers
                    .FirstOrDefaultAsync(v => v.VoucherId == voucherCode &&
                                              v.StartDate <= DateOnly.FromDateTime(DateTime.Now) &&
                                              v.EndDate >= DateOnly.FromDateTime(DateTime.Now));
                if (voucher == null)
                {
                    return false; // Invalid voucher
                }

                // Parse the discount percentage
                if (!double.TryParse(voucher.Description, out discountPercentage))
                {
                    discountPercentage = 0; // Default to 0 if parsing fails
                }
            }

            string PaymentUrl = null!;
            string OrderIdTemp = GenerateNewOrderIdServicesAsync();
            var transaction = new FPetSpa.Repository.Data.Transaction
            {
                TransactionId = GenerateNewTransactionIDAsync(),
                MethodId = methodId,
                Status = (int)TransactionStatus.NOTPAID,
                TransactionDate = DateOnly.FromDateTime(DateTime.Now)
            };

            FPetSpa.Repository.Data.Order orderTemp = new FPetSpa.Repository.Data.Order
            {
                OrderId = OrderIdTemp,
                StaffId = staffID,
                CustomerId = CustomerId,
                Total = totalPriceInUSD,
                TransactionId = transaction.TransactionId,
                RequiredDate = bookingDateTime,
                Status = (int)OrderStatusEnum.Pending,
                VoucherId = voucher?.VoucherId // Save the voucher ID
            };
            // Apply the voucher discount
            if (discountPercentage > 0)
            {
                orderTemp.Total = Decimal.Multiply((decimal)orderTemp.Total, Decimal.Subtract(1, (decimal)discountPercentage));
                // Apply voucher discount
            }

            ServiceOrderDetail serviceOrderDetail = new ServiceOrderDetail
            {
                ServiceId = service.ServiceId,
                OrderId = OrderIdTemp,
                PetId = PetId,
                Discount = discountPercentage,
                Price = totalPriceInUSD,
                PetWeight = pet.PetWeight
            };

            _context.Transactions.Add(transaction);
            _context.Orders.Add(orderTemp);
            _context.ServiceOrderDetails.Add(serviceOrderDetail);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public virtual async Task<Boolean> AfterCheckOutService(string orderId)
    {
        FPetSpa.Repository.Data.Order order = await _context.Orders.FindAsync(orderId);
        ServiceOrderDetail serviceOrderDetail = _context.ServiceOrderDetails.FirstOrDefault(p => p.OrderId == orderId);
        FPetSpa.Repository.Data.Transaction transaction = await _context.Transactions.FindAsync(order.TransactionId);
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
                byte[] qrCodeBase64 = GenerateQRCode($"{orderId}");
                var body = this.BodySendMailService(user, order, Pet!, Services!);
                await _sendMailServicers.SendEmailWithQRCodeAsync(

                    user.Email!,
                    "[CHECKOUT MAIL]",
                     body, qrCodeBase64);
                return true;
            }
        }
        return false!;
    }
    public virtual async Task<Boolean> AfterCheckOutServiceAddMoreProduct(string orderId)
    {
        FPetSpa.Repository.Data.Order order = await _context.Orders.FindAsync(orderId);
        FPetSpa.Repository.Data.Transaction transaction = await _context.Transactions.FindAsync(order.TransactionId);
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
                var productSendHtml = orderDetail.Select(product => $@"
            <tr>
                <td valign=""top"">
                    <!--[if mso | IE]>
                    <table style=""width: 100%;"">
                        <tr>
                    <![endif]-->
                    <!--[if mso | IE]>
                    <td valign=""top"">
                        <table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0"">
                            <tr>
                                <td style=""vertical-align:top;"">
                    <![endif]-->
                    <div style=""display: inline-block; vertical-align: top;"" class=""product-box-col"">
                        <table style=""width:100%"">
                            <tbody>
                                <tr>
                                    <td style=""width:200px;padding: 0 30px 0 24px;"" align=""left"" class=""gr-image-container product-box-col"">
                                        <img src=""{_image.GetLinkByName("productfpetspa", _context.Products.Find(product.ProductId)!.PictureName!).Result}"" alt=""{product.ProductId}"" style=""border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;"" width=""200"" height=""auto"" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <![endif]-->
                    <!--[if mso | IE]>
                    </td></tr></table></td>
                    <![endif]-->
                    <div style=""display: inline-block; width: 316px; vertical-align: top;"" class=""product-box-col"">
                        <table style=""width:100%"">
                            <tbody>
                                <tr>
                                    <td valign=""top"">
                                        <table style=""width: 100%;"">
                                            <tbody>
                                                <tr>
                                                    <td style=""line-height: normal;font-family: Arial;font-size: 16px;color: #1F262F;font-weight: bold;text-decoration: initial;font-style: initial;padding: 20px 0 8px 0;"" align=""left"" class=""product-box-col-text"">
                                                        {_context.Products.Find(product.ProductId)!.ProductName}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""line-height: normal;font-family: Arial;font-size: 14px;color: #4D5C70;font-weight: initial;text-decoration: initial;font-style: initial;padding: 0 30px 16px 0;"" align=""left"" class=""product-box-col-text"">
                                                        {product.Quantity}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""line-height: normal;font-family: Arial;font-size: 24px;color: #000000;font-weight: bold;text-decoration: initial;font-style: initial;padding: 0 0 10px 0;"" align=""left"" class=""product-box-col-text"">
                                                        {product.Price:C}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""padding: 27px 0 20px 0;; width:100%"" align=""left"" class=""product-box-col-text"">
                                                        <div style=""display: inline-block"">
                                                            <table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;"">
                                                                <tbody>
                                                                    <tr></tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        ").ToList();
                var productSendHtmlRe = string.Join("", productSendHtml);
                var bodyHtml = this.BodySendMailProduct(productSendHtmlRe, user);

                await _sendMailServicers.SendEmailAsync(
                  user.Email,
                 "[CHECKOUT MAIL]",
                 bodyHtml);
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
        FPetSpa.Repository.Data.Order order = await _context.Orders.FindAsync(orderid);
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
        FPetSpa.Repository.Data.Order order = await _context.Orders.FindAsync(orderid!)!;
        if (order == null) return null!;
        if (productDetails.IsNullOrEmpty()) return null!;
        decimal totalPriceInUSD = 0;
        foreach (var item in productDetails)
        {
            Product product = await _context.Products.FindAsync(item.ProductId);
            if (product == null) continue;
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
                    PayPalPaymentRequest payPalPaymentRequest = new PayPalPaymentRequest
                    {
                        Amount = totalPriceInUSD,
                        Currency = "USD",
                        Description = orderid + "_" + Guid.NewGuid().ToString()
                    };
                    var result = _paypalServices.CreatePayment(payPalPaymentRequest, RETURN_URL + $"?method=PAYPAL&orderId={orderid}", RETURN_URL);
                    PaymentUrl = result.ApprovalUrl;
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
        FPetSpa.Repository.Data.Order order = _context.Orders.Find(OrderId);
        if (order == null) return null;
        var user = _userManager.FindByIdAsync(order.CustomerId!).Result;
        if (user != null)
        {
            FPetSpa.Repository.Data.Transaction transaction = _context.Transactions.Find(order.TransactionId)!;
            if (transaction != null)
            {
                if (transaction.Status == (int)TransactionStatus.PAID) return null;
                string Method = _context.PaymentMethods.Find(transaction.MethodId)!.MethodName!;
                string PaymentUrl = null!;
                using (var transactionCheck = _context.Database.BeginTransaction())
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
                                PayPalPaymentRequest payPalPaymentRequest = new PayPalPaymentRequest
                                {
                                    Amount = order.Total!.Value,
                                    Currency = "USD",
                                    Description = order.OrderId + "_" + Guid.NewGuid().ToString(),
                                };
                                var result = _paypalServices.CreatePayment(payPalPaymentRequest, RETURN_URL + $"?method=PAYPAL&orderId={order.OrderId}", RETURN_URL);
                                PaymentUrl = result.ApprovalUrl;
                                break;
                            default:
                                return null;
                        }
                        _context.Database.CommitTransaction();

                        return PaymentUrl;
                    }
                    catch (Exception e)
                    {
                        _context.Database.RollbackTransaction();
                    }
                }
            }
        }
        return null;
    }
    public byte[] GenerateQRCode(string text)
    {
        using (var qrGenerator = new QRCodeGenerator())
        {
            var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrCodeData);
            return qrCode.GetGraphic(20);

        }
    }


    public async Task<Boolean> CheckInService(string OrderId)
    {
        FPetSpa.Repository.Data.Order order = await _context.Orders.FindAsync(OrderId);
        if (order != null && OrderId.StartsWith("ORS"))
        {
            if (order.Status == (byte)OrderStatusEnum.StaffAccepted)
            {
                order.Status = (byte)OrderStatusEnum.Processing;
                _context.Update(order);
                _context.SaveChanges();
                return true;
            }
        }else if(OrderId.StartsWith("ORP"))
        {
            if(order!.Status == (byte)OrderProductStatusEnum.ReadyForPickup)
            {
                order.Status = (byte)OrderProductStatusEnum.Succesfully;
                _context.Update(order);
                _context.SaveChanges();
                return true;
            }
        }
        return false;
    }

    public async Task<Boolean> UpdateOrderStatus(string orderid, string status)
    {
        var order = _context.Orders.Find(orderid);
        if (order != null)
        {
            if (!string.IsNullOrEmpty(status))
            {
                if (status.ToUpper().Equals("PROCESSING") || status.ToUpper().Equals("STAFFACCEPTED") || status.ToUpper().Equals("SUCCESSFULLY"))
                {
                    if (status.ToUpper().Equals("PROCESSING")) order.Status = (byte)OrderStatusEnum.Processing;
                    else if (status.ToUpper().Equals("STAFFACCEPTED")) order.Status = (byte)OrderStatusEnum.StaffAccepted;
                    else order.Status = (byte)OrderStatusEnum.Sucessfully;
                    _context.Orders.Update(order);
                    _context.SaveChanges();
                    return true;
                }
                else if (status.ToUpper().Equals("CANCEL"))
                {
                    order.Status = (byte)OrderStatusEnum.Cancel;
                    _context.Orders.Update(order);
                    _context.SaveChanges();
                    return true;
                }
            }
        }
        return false;
    }


    public async Task<Boolean> UpdateProductOrderStatus(string orderid, string status)
    {
        var order = _context.Orders.Find(orderid);
        if (order != null)
        {
            if (!string.IsNullOrEmpty(status))
            {
                var check = false;
                if(status.ToUpper().Equals("STAFFACCEPTED"))
                {
                    order.Status = (byte)OrderProductStatusEnum.StaffAccepted;
                     check = true;
                }
                if (order.DeliveryOption.ToUpper().Equals("SHIPPING"))
                {
                    if (status.ToUpper().Equals("PROCESSING"))
                    {
                        order.Status = (byte)OrderProductStatusEnum.Processing;
                        check = true;
                    }
                    else if (status.ToUpper().Equals("SHIPPED"))
                    {
                        order.Status = (byte)OrderProductStatusEnum.Shipped;
                        check = true;
                    }
                }
                if (order.DeliveryOption.ToUpper().Equals("PICKUP"))
                {
                     if (status.ToUpper().Equals("READYFORPICKUP"))
                    {
                        order.Status = (byte)OrderProductStatusEnum.ReadyForPickup;
                        check = true;
                    }
                    else if (status.ToUpper().Equals("SUCCESSFULLY"))
                    {
                        order.Status = (byte)OrderProductStatusEnum.Succesfully;
                        check = true;
                    }
                }
                if (check == true)
                {
                    _context.Orders.Update(order);
                    _context.SaveChanges();
                    return true;
                }
            }
        }
        return false;
    }


    public async Task<Boolean> UpdateProductOrderStatusByUser(string orderid, string status)
    {
        var order = _context.Orders.Find(orderid);
        if(order != null)
        {
            if (!string.IsNullOrEmpty(status) && status.ToUpper().Equals("DELIVERED"))
            {
                order.Status = (byte)OrderProductStatusEnum.Delivered;
                _context.Orders.Update(order);
                _context.SaveChanges();
                return true;
            }
        }
        return false;
    }

    public string BodySendMailService(ApplicationUser user, FPetSpa.Repository.Data.Order order, Pet pet, Service service)
    {
        return $@"<!doctype html><html lang=""und"" dir=""auto"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office""><head><title></title><!--[if !mso]><!--><meta http-equiv=""X-UA-Compatible"" content=""IE=edge""><!--<![endif]--><meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""><style type=""text/css"">#outlook a {{ padding:0; }}
      body {{ margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }}
      table, td {{ border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }}
      img {{ border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }}
      p {{ display:block;margin:13px 0; }}</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type=""text/css"">
      .mj-outlook-group-fix {{ width:100% !important; }}
    </style>
    <![endif]--><style type=""text/css"">@media only screen and (min-width:480px) {{
        .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
.mj-column-per-50 {{ width:50% !important; max-width: 50%; }}
.mj-column-per-33-33333333333343 {{ width:33.33333333333343% !important; max-width: 33.33333333333343%; }}
      }}</style><style media=""screen and (min-width:480px)"">.moz-text-html .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
.moz-text-html .mj-column-per-50 {{ width:50% !important; max-width: 50%; }}
.moz-text-html .mj-column-per-33-33333333333343 {{ width:33.33333333333343% !important; max-width: 33.33333333333343%; }}</style><style type=""text/css"">@media only screen and (max-width:479px) {{
      table.mj-full-width-mobile {{ width: 100% !important; }}
      td.mj-full-width-mobile {{ width: auto !important; }}
    }}</style><style type=""text/css"">@media (max-width: 479px) {{
.hide-on-mobile {{
display: none !important;
}}
}}
.gr-mlimage-kjsksc img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-ixiwpb {{
height: 99px !important;
}}
}}
.gr-mltext-npkptk a,
.gr-mltext-npkptk a:visited {{
text-decoration: none;
}}
.gr-mlbutton-gkdgul p {{
direction: ltr;
}}
.gr-mlimage-kjsksc img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-mlwtxp {{
height: 238.955087076077px !important;
}}
}}
.gr-mltext-mugjmp a,
.gr-mltext-mugjmp a:visited {{
text-decoration: none;
}}
.gr-productbox-hegmlh {{
width: 100%;
}}
@media (min-width: 480px) {{
.gr-productbox-eookqh .gr-productbox-image-container img {{
width: 200px !important;
}}
}}@media (max-width: 480px) {{
.gr-productbox-eookqh .gr-productbox-image-container {{
width: auto !important;
}}
.gr-productbox-eookqh .product-box-col {{
width: 100% !important;
padding-left: 0 !important;
padding-right: 0 !important;
}}
.gr-productbox-eookqh .product-box-col-text {{
text-align: center;
}}
.gr-productbox-eookqh .product-box-col-gap {{
height: 0;
}}
}}
.gr-mlimage-kjsksc img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-imddrf {{
height: 241.29999999999998px !important;
}}
}}
.gr-mltext-voxlic a,
.gr-mltext-voxlic a:visited {{
text-decoration: none;
}}
.gr-mltext-vqeuxo a,
.gr-mltext-vqeuxo a:visited {{
text-decoration: none;
}}
.gr-mlbutton-jvwvqy p {{
direction: ltr;
}}
.gr-footer-ttnypb a,
.gr-footer-ttnypb a:visited {{
color: #FF5959;
text-decoration: underline;
}}</style><link href=""https://fonts.googleapis.com/css?display=swap&family=Barlow:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese"" rel=""stylesheet"" type=""text/css""><style type=""text/css"">@import url(https://fonts.googleapis.com/css?display=swap&family=Barlow:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese);</style></head><body style=""word-spacing:normal;background-color:#FFFFFF;""><div style=""background-color:#FFFFFF;"" lang=""und"" dir=""auto""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:20px 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-kjsksc gr-mlimage-ixiwpb"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:114px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/9fbcaa17-f793-48cd-97c7-2874be625012.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""114"" height=""auto""></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;border-radius:20px 20px 0 0;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;border-radius:20px 20px 0 0;""><tbody><tr><td style=""border-bottom:0 none #000;border-left:0 none #000;border-right:0 none #000;border-top:0 none #000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:19px 0;word-break:break-word;""><p style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:300px;"" role=""presentation"" width=""300px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:42px;line-height:42px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-fmbgbx gr-mltext-npkptk"" style=""font-size:0px;padding:0 40px 14px 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #2F2F0F""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Thank you, {user.FullName}, for choosing us.</span></span></strong></span></p></div></td></tr><tr><td align=""left"" class=""gr-mlbutton-jimoec gr-mlbutton-gkdgul link-id-9b9042947b19"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""#FF5959"" role=""presentation"" style=""border:none;border-bottom:0 none #000000;border-left:0 none #000000;border-radius:999px;border-right:0 none #000000;border-top:0 none #000000;cursor:auto;font-style:normal;mso-padding-alt:15px 30px;background:#FF5959;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:#FF5959;color:#FFFFFF;font-family:Barlow, Arial, sans-serif;font-size:14px;font-style:normal;font-weight:bold;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:999px;""><a style=""color: #FFFFFF; text-decoration: none;"" href={HOMEPAGE}>Home Page</a></p></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:19px 1px 20px 0;word-break:break-word;""><p style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:299px;"" role=""presentation"" width=""299px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-kjsksc gr-mlimage-mlwtxp"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:300px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/5efc67ec-47d2-43d7-9267-88de74e2a3a0.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""300"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-fmbgbx gr-mltext-mugjmp"" style=""font-size:0px;padding:0;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #FFFFFF""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Order Details</span></span></strong></span></p></div></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:35px 5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""gr-productbox-hegmlh gr-productbox-eookqh"" style=""font-size:0px;word-break:break-word;""><!-- START Product box block--><table style=""font-size: 16px; width: 100%;"" cellspacing=""0"" cellpadding=""0""><tbody><tr><td valign=""top""><!--[if mso | IE]><table style=""width: 100%;""><tr><![endif]--><!--[if mso | IE]><td valign=""top""><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td style=""vertical-align:top;"" ><![endif]--><div style=""display: inline-block; vertical-align: top;"" class=""product-box-col""><table style=""width:100%""><tbody><tr><td style=""width:200px;padding: 0 30px 0 24px;"" align=""left"" class=""gr-image-container product-box-col""><img src=""{_image.GetLinkByName("fpetspaservices", service.PictureName).Result}"" alt=""Clean "" style=""border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;"" width=""200"" height=""auto""></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;"" ><![endif]--><div style=""display: inline-block; width: 316px; vertical-align: top;"" class=""product-box-col""><table style=""width:100%""><tbody><tr><td valign=""top""><table style=""width: 100%;""><tbody><tr><td style=""line-height: normal;font-family: Arial;font-size: 16px;color: #1F262F;font-weight: bold;text-decoration: initial;font-style: initial;padding: 20px 0 8px 0;"" align=""left"" class=""product-box-col-text"">{service.ServiceName}</td></tr><tr><td style=""line-height: normal;font-family: Arial;font-size: 14px;color: #4D5C70;font-weight: initial;text-decoration: initial;font-style: initial;padding: 0 30px 16px 0;"" align=""left"" class=""product-box-col-text"">{pet.PetName}</td></tr><tr><td style=""line-height: normal;font-family: Arial;font-size: 24px;color: #000000;font-weight: bold;text-decoration: initial;font-style: initial;padding: 0 0 10px 0;"" align=""left"" class=""product-box-col-text"">{order.Total}US$</td></tr><tr><td style=""padding: 27px 0 20px 0;; width:100%"" align=""left"" class=""product-box-col-text""><div style=""display: inline-block""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td style=""border: none;cursor: auto;border-top: 0 none #000000;border-bottom: 0 none #000000;border-left: 0 none #000000;border-right: 0 none #000000;border-radius: 4px;background-color: #202730;"" class=""product-box-col-text""><a href=""null"" class="""" style=""line-height: 120%;margin: 0;text-transform: none;background-color: #202730;color: #FFFFFF;font-family: Arial;font-size: 14px;font-weight: bold;text-decoration: initial;font-style: initial;padding: 14px 32px;border-radius: 4px;"" target=""_blank""><span style=""color: #FFFFFF;"">BUY NOW</span></a></td></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table></td""><![endif]--></td></tr></tbody></table><!-- END Product box block--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:15px;line-height:15px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-kjsksc gr-mlimage-imddrf"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:285px;""><img alt=""QR Code"" src=""cid:qrcode"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""285"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-fmbgbx gr-mltext-voxlic"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #2F2F0F""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Please show this QR for checkin ⚡</span></span></strong></span></p></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-fmbgbx gr-mltext-vqeuxo"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #3D3D3B""><span style=""font-size: 12px""><span style=""font-family: Roboto, Arial, sans-serif"">You can count on us to deliver quality product right when you need it.</span></span></span></p></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mlbutton-jimoec gr-mlbutton-jvwvqy link-id-30bb1b9a6d38"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""#FF5959"" role=""presentation"" style=""border:none;border-bottom:0 none #000000;border-left:0 none #000000;border-radius:999px;border-right:0 none #000000;border-top:0 none #000000;cursor:auto;font-style:normal;mso-padding-alt:15px 30px;background:#FF5959;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:#FF5959;color:#FFFFFF;font-family:Barlow, Arial, sans-serif;font-size:14px;font-style:normal;font-weight:bold;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:999px;""><a style=""color: #FFFFFF; text-decoration: none;"" href={HOMEPAGE}>Order Now</a></p></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""center"" style=""font-size:0px;padding:5px;word-break:break-word;""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" ><tr><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-3f7e59d97f62""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://facebook.com"" target=""_blank""><img alt=""facebook"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/facebook3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-202ad0979aa0""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://twitter.com"" target=""_blank""><img alt=""twitter"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/twitter3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-12577ba2bec9""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://instagram.com"" target=""_blank""><img alt=""instagram"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/instagram3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-08da93c29559""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://youtube.com"" target=""_blank""><img alt=""youtube"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/youtube3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-footer-unfpsn gr-footer-ttnypb"" style=""font-size:0px;padding:10px;word-break:break-word;""><div style=""font-family:Roboto, Arial, sans-serif;font-size:10px;font-style:normal;line-height:1;text-align:center;text-decoration:none;color:#D1D1D1;""><div>, 40C, 70000, Ho Chi Minh City, Công Hòa Xã Hội Chủ Nghĩa Việt Nam<br><br>Bạn có thể <a href=""https://app.getresponse.com/unsubscribe.html?x=a62b&m=E&mc=JU&s=E&u=VEjc9&z=EwAEGWu&pt=unsubscribe"" target=""_blank"">hủy đăng ký</a> hoặc <a href=""https://app.getresponse.com/change_details.html?x=a62b&m=E&s=E&u=VEjc9&z=EhkpGog&pt=change_details"" target=""_blank"">thay đổi thông tin liên hệ</a> bất cứ lúc nào.</div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--><table align=""center"" style=""font-family: 'Roboto', Helvetica, sans-serif; font-weight: 400; letter-spacing: .018em; text-align: center; font-size: 10px;""><tr><td style=""padding-bottom: 20px""><br /><div style=""color: #939598;"">Cung cấp bởi:</div><a href=""https://app.getresponse.com/referral.html?x=a62b&c=Z2q4h&u=VEjc9&z=ESCgVaB&""><img src=""https://app.getresponse.com/images/common/templates/badges/gr_logo_2.png"" alt=""GetResponse"" border=""0"" style=""display:block;"" width=""120"" height=""24""/></a></td></tr></table></div></body></html>";
    }


    public string BodySendMailProduct(string productHtml, ApplicationUser user)
    {
        return $@"<!doctype html><html lang=""und"" dir=""auto"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office""><head><title></title><!--[if !mso]><!--><meta http-equiv=""X-UA-Compatible"" content=""IE=edge""><!--<![endif]--><meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""><style type=""text/css"">#outlook a {{ padding:0; }}
      body {{ margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }}
      table, td {{ border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }}
      img {{ border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }}
      p {{ display:block;margin:13px 0; }}</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type=""text/css"">
      .mj-outlook-group-fix {{ width:100% !important; }}
    </style>
    <![endif]--><style type=""text/css"">@media only screen and (min-width:480px) {{
        .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
.mj-column-per-50 {{ width:50% !important; max-width: 50%; }}
.mj-column-per-33-33333333333343 {{ width:33.33333333333343% !important; max-width: 33.33333333333343%; }}
      }}</style><style media=""screen and (min-width:480px)"">.moz-text-html .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
.moz-text-html .mj-column-per-50 {{ width:50% !important; max-width: 50%; }}
.moz-text-html .mj-column-per-33-33333333333343 {{ width:33.33333333333343% !important; max-width: 33.33333333333343%; }}</style><style type=""text/css"">@media only screen and (max-width:479px) {{
      table.mj-full-width-mobile {{ width: 100% !important; }}
      td.mj-full-width-mobile {{ width: auto !important; }}
    }}</style><style type=""text/css"">@media (max-width: 479px) {{
.hide-on-mobile {{
display: none !important;
}}
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-swycvj {{
height: 99px !important;
}}
}}
.gr-mltext-kccalt a,
.gr-mltext-kccalt a:visited {{
text-decoration: none;
}}
.gr-mlbutton-mdvvfn p {{
direction: ltr;
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-cfihit {{
height: 238.955087076077px !important;
}}
}}
.gr-mltext-gqklqq a,
.gr-mltext-gqklqq a:visited {{
text-decoration: none;
}}
.gr-productbox-nkeymm {{
width: 100%;
}}
@media (min-width: 480px) {{
.gr-productbox-hwvfkn .gr-productbox-image-container img {{
width: 200px !important;
}}
}}@media (max-width: 480px) {{
.gr-productbox-hwvfkn .gr-productbox-image-container {{
width: auto !important;
}}
.gr-productbox-hwvfkn .product-box-col {{
width: 100% !important;
padding-left: 0 !important;
padding-right: 0 !important;
}}
.gr-productbox-hwvfkn .product-box-col-text {{
text-align: center;
}}
.gr-productbox-hwvfkn .product-box-col-gap {{
height: 0;
}}
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-rldbdg {{
height: 241.29999999999998px !important;
}}
}}
.gr-mltext-bfgaui a,
.gr-mltext-bfgaui a:visited {{
text-decoration: none;
}}
.gr-mltext-ehequc a,
.gr-mltext-ehequc a:visited {{
text-decoration: none;
}}
.gr-mlbutton-gyotop p {{
direction: ltr;
}}
.gr-footer-knxcnc a,
.gr-footer-knxcnc a:visited {{
color: #FF5959;
text-decoration: underline;
}}</style><link href=""https://fonts.googleapis.com/css?display=swap&family=Barlow:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese"" rel=""stylesheet"" type=""text/css""><style type=""text/css"">@import url(https://fonts.googleapis.com/css?display=swap&family=Barlow:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese);</style></head><body style=""word-spacing:normal;background-color:#FFFFFF;""><div style=""background-color:#FFFFFF;"" lang=""und"" dir=""auto""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:20px 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-swycvj"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:114px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/43d2bd92-529b-4224-ba35-9821b805712e.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""114"" height=""auto""></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;border-radius:20px 20px 0 0;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;border-radius:20px 20px 0 0;""><tbody><tr><td style=""border-bottom:0 none #000;border-left:0 none #000;border-right:0 none #000;border-top:0 none #000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:19px 0;word-break:break-word;""><p style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:300px;"" role=""presentation"" width=""300px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:42px;line-height:42px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-kccalt"" style=""font-size:0px;padding:0 40px 14px 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #2F2F0F""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Thank you, {user.FullName}, for choosing us.</span></span></strong></span></p></div></td></tr><tr><td align=""left"" class=""gr-mlbutton-amvhba gr-mlbutton-mdvvfn link-id-9b9042947b19"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""#FF5959"" role=""presentation"" style=""border:none;border-bottom:0 none #000000;border-left:0 none #000000;border-radius:999px;border-right:0 none #000000;border-top:0 none #000000;cursor:auto;font-style:normal;mso-padding-alt:15px 30px;background:#FF5959;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:#FF5959;color:#FFFFFF;font-family:Barlow, Arial, sans-serif;font-size:14px;font-style:normal;font-weight:bold;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:999px;""><a style=""color: #FFFFFF; text-decoration: none;"" href={HOMEPAGE}>Home Page</a></p></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:19px 1px 20px 0;word-break:break-word;""><p style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:299px;"" role=""presentation"" width=""299px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-cfihit"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:300px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/0756aba5-8b85-4df5-8300-012f67abd1aa.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""300"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-gqklqq"" style=""font-size:0px;padding:0;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #FFFFFF""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Order Details</span></span></strong></span></p></div></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:35px 5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""gr-productbox-nkeymm gr-productbox-hwvfkn"" style=""font-size:0px;word-break:break-word;""><!-- START Product box block--><table style=""font-size: 16px; width: 100%;"" cellspacing=""0"" cellpadding=""0""><tbody>{productHtml}</tbody></table><!-- END Product box block--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:15px;line-height:15px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-rldbdg"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:285px;""><img alt="""" src=""https://s3.amazonaws.com/gr-share-us/email-marketing/message-templates/MW/6a1b4cb5-e5d3-4b43-b5fc-731f946f1205.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""285"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-bfgaui"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #2F2F0F""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Delivered to your door in a zap⚡</span></span></strong></span></p></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-ehequc"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #3D3D3B""><span style=""font-size: 12px""><span style=""font-family: Roboto, Arial, sans-serif"">You can count on us to deliver quality product right when you need it.</span></span></span></p></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mlbutton-amvhba gr-mlbutton-gyotop link-id-30bb1b9a6d38"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""#FF5959"" role=""presentation"" style=""border:none;border-bottom:0 none #000000;border-left:0 none #000000;border-radius:999px;border-right:0 none #000000;border-top:0 none #000000;cursor:auto;font-style:normal;mso-padding-alt:15px 30px;background:#FF5959;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:#FF5959;color:#FFFFFF;font-family:Barlow, Arial, sans-serif;font-size:14px;font-style:normal;font-weight:bold;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:999px;""><a style=""color: #FFFFFF; text-decoration: none;"" href={HOMEPAGE}>Order Now</a></p></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""center"" style=""font-size:0px;padding:5px;word-break:break-word;""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" ><tr><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-3f7e59d97f62""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://facebook.com"" target=""_blank""><img alt=""facebook"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/facebook3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-202ad0979aa0""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://twitter.com"" target=""_blank""><img alt=""twitter"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/twitter3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-12577ba2bec9""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://instagram.com"" target=""_blank""><img alt=""instagram"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/instagram3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-08da93c29559""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://youtube.com"" target=""_blank""><img alt=""youtube"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/youtube3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-footer-cahjoy gr-footer-knxcnc"" style=""font-size:0px;padding:10px;word-break:break-word;""><div style=""font-family:Roboto, Arial, sans-serif;font-size:10px;font-style:normal;line-height:1;text-align:center;text-decoration:none;color:#D1D1D1;""><div>, 40C, 70000, Ho Chi Minh City, Công Hòa Xã Hội Chủ Nghĩa Việt Nam<br><br>Bạn có thể <a href=""https://app.getresponse.com/unsubscribe.html?x=a62b&m=E&mc=JY&s=E&u=VEjc9&z=EEsXVXH&pt=unsubscribe"" target=""_blank"">hủy đăng ký</a> hoặc <a href=""https://app.getresponse.com/change_details.html?x=a62b&m=E&s=E&u=VEjc9&z=EJ3UhPq&pt=change_details"" target=""_blank"">thay đổi thông tin liên hệ</a> bất cứ lúc nào.</div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--><table align=""center"" style=""font-family: 'Roboto', Helvetica, sans-serif; font-weight: 400; letter-spacing: .018em; text-align: center; font-size: 10px;""><tr><td style=""padding-bottom: 20px""><br /><div style=""color: #939598;"">Cung cấp bởi:</div><a href=""https://app.getresponse.com/referral.html?x=a62b&c=Z2q4h&u=VEjc9&z=EQ9KJ03&""><img src=""https://app.getresponse.com/images/common/templates/badges/gr_logo_2.png"" alt=""GetResponse"" border=""0"" style=""display:block;"" width=""120"" height=""24""/></a></td></tr></table></div></body></html>";
    }


    public string BodySendMailProductPickUp(string productHtml, ApplicationUser user)
    {
        return $@"<!doctype html><html lang=""und"" dir=""auto"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office""><head><title></title><!--[if !mso]><!--><meta http-equiv=""X-UA-Compatible"" content=""IE=edge""><!--<![endif]--><meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""><style type=""text/css"">#outlook a {{ padding:0; }}
      body {{ margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }}
      table, td {{ border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }}
      img {{ border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }}
      p {{ display:block;margin:13px 0; }}</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type=""text/css"">
      .mj-outlook-group-fix {{ width:100% !important; }}
    </style>
    <![endif]--><style type=""text/css"">@media only screen and (min-width:480px) {{
        .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
.mj-column-per-50 {{ width:50% !important; max-width: 50%; }}
.mj-column-per-33-33333333333343 {{ width:33.33333333333343% !important; max-width: 33.33333333333343%; }}
      }}</style><style media=""screen and (min-width:480px)"">.moz-text-html .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
.moz-text-html .mj-column-per-50 {{ width:50% !important; max-width: 50%; }}
.moz-text-html .mj-column-per-33-33333333333343 {{ width:33.33333333333343% !important; max-width: 33.33333333333343%; }}</style><style type=""text/css"">@media only screen and (max-width:479px) {{
      table.mj-full-width-mobile {{ width: 100% !important; }}
      td.mj-full-width-mobile {{ width: auto !important; }}
    }}</style><style type=""text/css"">@media (max-width: 479px) {{
.hide-on-mobile {{
display: none !important;
}}
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-swycvj {{
height: 99px !important;
}}
}}
.gr-mltext-kccalt a,
.gr-mltext-kccalt a:visited {{
text-decoration: none;
}}
.gr-mlbutton-mdvvfn p {{
direction: ltr;
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-cfihit {{
height: 238.955087076077px !important;
}}
}}
.gr-mltext-gqklqq a,
.gr-mltext-gqklqq a:visited {{
text-decoration: none;
}}
.gr-productbox-nkeymm {{
width: 100%;
}}
@media (min-width: 480px) {{
.gr-productbox-hwvfkn .gr-productbox-image-container img {{
width: 200px !important;
}}
}}@media (max-width: 480px) {{
.gr-productbox-hwvfkn .gr-productbox-image-container {{
width: auto !important;
}}
.gr-productbox-hwvfkn .product-box-col {{
width: 100% !important;
padding-left: 0 !important;
padding-right: 0 !important;
}}
.gr-productbox-hwvfkn .product-box-col-text {{
text-align: center;
}}
.gr-productbox-hwvfkn .product-box-col-gap {{
height: 0;
}}
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-rldbdg {{
height: 241.29999999999998px !important;
}}
}}
.gr-mltext-bfgaui a,
.gr-mltext-bfgaui a:visited {{
text-decoration: none;
}}
.gr-mltext-ehequc a,
.gr-mltext-ehequc a:visited {{
text-decoration: none;
}}
.gr-mlbutton-gyotop p {{
direction: ltr;
}}
.gr-footer-knxcnc a,
.gr-footer-knxcnc a:visited {{
color: #FF5959;
text-decoration: underline;
}}</style><link href=""https://fonts.googleapis.com/css?display=swap&family=Barlow:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese"" rel=""stylesheet"" type=""text/css""><style type=""text/css"">@import url(https://fonts.googleapis.com/css?display=swap&family=Barlow:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese);</style></head><body style=""word-spacing:normal;background-color:#FFFFFF;""><div style=""background-color:#FFFFFF;"" lang=""und"" dir=""auto""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:20px 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-swycvj"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:114px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/43d2bd92-529b-4224-ba35-9821b805712e.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""114"" height=""auto""></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;border-radius:20px 20px 0 0;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;border-radius:20px 20px 0 0;""><tbody><tr><td style=""border-bottom:0 none #000;border-left:0 none #000;border-right:0 none #000;border-top:0 none #000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:19px 0;word-break:break-word;""><p style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:300px;"" role=""presentation"" width=""300px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:42px;line-height:42px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-kccalt"" style=""font-size:0px;padding:0 40px 14px 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #2F2F0F""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Thank you, {user.FullName}, for choosing us.</span></span></strong></span></p></div></td></tr><tr><td align=""left"" class=""gr-mlbutton-amvhba gr-mlbutton-mdvvfn link-id-9b9042947b19"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""#FF5959"" role=""presentation"" style=""border:none;border-bottom:0 none #000000;border-left:0 none #000000;border-radius:999px;border-right:0 none #000000;border-top:0 none #000000;cursor:auto;font-style:normal;mso-padding-alt:15px 30px;background:#FF5959;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:#FF5959;color:#FFFFFF;font-family:Barlow, Arial, sans-serif;font-size:14px;font-style:normal;font-weight:bold;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:999px;""><a style=""color: #FFFFFF; text-decoration: none;"" href={HOMEPAGE}>Home Page</a></p></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:19px 1px 20px 0;word-break:break-word;""><p style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:solid 1px #000000;font-size:1px;margin:0px auto;width:299px;"" role=""presentation"" width=""299px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-cfihit"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:300px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/0756aba5-8b85-4df5-8300-012f67abd1aa.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""300"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-gqklqq"" style=""font-size:0px;padding:0;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #FFFFFF""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Order Details</span></span></strong></span></p></div></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:35px 5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""gr-productbox-nkeymm gr-productbox-hwvfkn"" style=""font-size:0px;word-break:break-word;""><!-- START Product box block--><table style=""font-size: 16px; width: 100%;"" cellspacing=""0"" cellpadding=""0""><tbody>{productHtml}</tbody></table><!-- END Product box block--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FF5959"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FF5959;background-color:#FF5959;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FF5959;background-color:#FF5959;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:200.00000000000057px;"" ><![endif]--><div class=""mj-column-per-33-33333333333343 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:15px;line-height:15px;"">&#8202;</div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FBFBF3"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FBFBF3;background-color:#FBFBF3;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FBFBF3;background-color:#FBFBF3;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-rldbdg"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:285px;""><img alt=""QR Code"" src=""cid:qrcode"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""285"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td><td class="""" style=""vertical-align:top;width:300px;"" ><![endif]--><div class=""mj-column-per-50 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td class=""hide-on-mobile"" style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-bfgaui"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #2F2F0F""><strong><span style=""font-size: 32px""><span style=""font-family: Barlow, Arial, sans-serif"">Please show this QR Code for take our stuff⚡</span></span></strong></span></p></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-ehequc"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #3D3D3B""><span style=""font-size: 12px""><span style=""font-family: Roboto, Arial, sans-serif"">You can count on us to deliver quality product right when you need it.</span></span></span></p></div></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""left"" class=""gr-mlbutton-amvhba gr-mlbutton-gyotop link-id-30bb1b9a6d38"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""#FF5959"" role=""presentation"" style=""border:none;border-bottom:0 none #000000;border-left:0 none #000000;border-radius:999px;border-right:0 none #000000;border-top:0 none #000000;cursor:auto;font-style:normal;mso-padding-alt:15px 30px;background:#FF5959;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:#FF5959;color:#FFFFFF;font-family:Barlow, Arial, sans-serif;font-size:14px;font-style:normal;font-weight:bold;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:999px;""><a style=""color: #FFFFFF; text-decoration: none;"" href={HOMEPAGE}>Order Now</a></p></td></tr></tbody></table></td></tr><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:40px;line-height:40px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:20px;line-height:20px;"">&#8202;</div></td></tr><tr><td align=""center"" style=""font-size:0px;padding:5px;word-break:break-word;""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" ><tr><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-3f7e59d97f62""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://facebook.com"" target=""_blank""><img alt=""facebook"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/facebook3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-202ad0979aa0""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://twitter.com"" target=""_blank""><img alt=""twitter"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/twitter3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-12577ba2bec9""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://instagram.com"" target=""_blank""><img alt=""instagram"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/instagram3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-08da93c29559""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://youtube.com"" target=""_blank""><img alt=""youtube"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/youtube3.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-footer-cahjoy gr-footer-knxcnc"" style=""font-size:0px;padding:10px;word-break:break-word;""><div style=""font-family:Roboto, Arial, sans-serif;font-size:10px;font-style:normal;line-height:1;text-align:center;text-decoration:none;color:#D1D1D1;""><div>, 40C, 70000, Ho Chi Minh City, Công Hòa Xã Hội Chủ Nghĩa Việt Nam<br><br>Bạn có thể <a href=""https://app.getresponse.com/unsubscribe.html?x=a62b&m=E&mc=JY&s=E&u=VEjc9&z=EEsXVXH&pt=unsubscribe"" target=""_blank"">hủy đăng ký</a> hoặc <a href=""https://app.getresponse.com/change_details.html?x=a62b&m=E&s=E&u=VEjc9&z=EJ3UhPq&pt=change_details"" target=""_blank"">thay đổi thông tin liên hệ</a> bất cứ lúc nào.</div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--><table align=""center"" style=""font-family: 'Roboto', Helvetica, sans-serif; font-weight: 400; letter-spacing: .018em; text-align: center; font-size: 10px;""><tr><td style=""padding-bottom: 20px""><br /><div style=""color: #939598;"">Cung cấp bởi:</div><a href=""https://app.getresponse.com/referral.html?x=a62b&c=Z2q4h&u=VEjc9&z=EQ9KJ03&""><img src=""https://app.getresponse.com/images/common/templates/badges/gr_logo_2.png"" alt=""GetResponse"" border=""0"" style=""display:block;"" width=""120"" height=""24""/></a></td></tr></table></div></body></html>";
    }
}




