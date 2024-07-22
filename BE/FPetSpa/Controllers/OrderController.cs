using FPetSpa.Models.OrderModel;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Model.OrderModel;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Services;
using FPetSpa.Repository.Services.PayPal;
using FPetSpa.Repository.Services.VnPay;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Drawing.Text;
using System.Linq.Expressions;
using System.Transactions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using TransactionStatus = FPetSpa.Repository.Helper.TransactionStatus;

namespace FPetSpa.Controllers
{
    [Route("api/Order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IVnPayService _vnpayServices;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPayPalService _payPalServices;
        private readonly IStaffServices _staffServices;
        public OrderController(IUnitOfWork unitOfWork, IVnPayService vnPayService, IPayPalService payPalService, IStaffServices staffServices)
        {
            _vnpayServices = vnPayService;
            _unitOfWork = unitOfWork;
            _payPalServices = payPalService;
            _staffServices = staffServices;
        }

        [HttpPost("{orderId}/assign-staff")]
        public async Task<IActionResult> AssignStaffToOrder(string orderId)
        {
            var (success, staff) = await _staffServices.AssignAvailableStaffToOrder(orderId);
            if (!success)
            {
                return BadRequest("Không có nhân viên rảnh rỗi hoặc đơn hàng không tồn tại.");
            }

            var message = $"Nhân viên {staff.StaffName} đã được gán vào đơn hàng của bạn.";
            return Ok(new { Message = message});
        }
     
        [HttpGet("OrderSearch")]
        public async Task<IActionResult> search([FromQuery] RequestSearchOrderModel model)
        {
            byte OrderStatus = 255;
            int transactionStatus = -1;
            if (!String.IsNullOrEmpty(model.OrderStatus))
            {
                 OrderStatus = model.OrderStatus.ToUpper().Equals("PENDING")
                    ? (byte)OrderStatusEnum.Pending : model.OrderStatus.ToUpper().Equals("PROCESSING")
                    ? (byte)OrderStatusEnum.Processing : model.OrderStatus.ToUpper().Equals("SUCESSFULLY")
                    ? (byte)OrderStatusEnum.Sucessfully : model.OrderStatus.ToUpper().Equals("CANCEL")
                    ? (byte)OrderStatusEnum.Cancel : model.OrderStatus.ToUpper().Equals("FALSE")
                    ? (byte)OrderStatusEnum.False : (byte)255;
                if(OrderStatus == 255) return BadRequest("Input field OrderStatus incorrect!!!");
            }
            if (!String.IsNullOrEmpty(model.TransactionStatus))
            {
                transactionStatus = model.TransactionStatus.ToUpper().Equals("PAID")
                   ? (int)TransactionStatus.PAID : model.TransactionStatus.ToUpper().Equals("NOTPAID")
                   ? (int)TransactionStatus.NOTPAID : -1;
                if (transactionStatus == -1) return BadRequest("Input field TransactionStatus incorrect!!!");
            }

            Expression<Func<Order, bool>> filter = x =>
            (string.IsNullOrEmpty(model.OrderStatus) || x.Status == OrderStatus) &&
            (model.CreatedDate == null || x.RequiredDate.Equals(model.CreatedDate)) &&
            (model.CustomeriD == null || x.CustomerId.Equals(model.CustomeriD)) && 
            (model.OrderId == null || x.OrderId.Equals(model.OrderId)) &&
            (model.DeliveryOption == null || x.DeliveryOption!.Equals(model.DeliveryOption));

            var response = _unitOfWork.OrderGenericRepo.Get
                (
                filter,
                null,
                includeProperties: "",
                null,
                null
                );
            if (response != null)
            {
                List<ResponseSearchOrderModel> listResponse = new List<ResponseSearchOrderModel>();

                if (transactionStatus != -1)
                {
                    foreach (var p in response.Where( p => ( _unitOfWork.TransactionRepository.GetById(p.TransactionId)).Status == transactionStatus).ToList()) 
                    {
                        var responseModel = new ResponseSearchOrderModel
                        {
                            CustomerId = p.CustomerId,
                            OrderId = p.OrderId,
                            RequiredDate = p.RequiredDate,
                            Status = p.Status,
                            Total = p.Total,
                            VoucherId = p.VoucherId,
                            DeliveryOption = p.DeliveryOption!,
                            TransactionStatus = (await _unitOfWork.TransactionRepository.GetByIdAsync(p.TransactionId!)).Status 
                        };
                        listResponse.Add(responseModel);
                    }

                    return Ok(listResponse);
                }
                foreach(var p in response)
                {
                    var responseModel = new ResponseSearchOrderModel
                    {
                        CustomerId = p.CustomerId,
                        OrderId = p.OrderId,
                        RequiredDate = p.RequiredDate,
                        Status = p.Status,
                        Total = p.Total,
                        VoucherId = p.VoucherId,
                        DeliveryOption = p.DeliveryOption!,
                        TransactionStatus = (await _unitOfWork.TransactionRepository.GetByIdAsync(p.TransactionId!)).Status
                    };
                    listResponse.Add(responseModel);
                };

                return Ok(listResponse);
            }
            return BadRequest();
        }

        [HttpGet("GetAllOrder")]
        public async Task<IActionResult> getAllOrder()
        {
             var result = await  _unitOfWork.OrderGenericRepo.GetAllAsync();
            if(result != null) return Ok(result); 
            return BadRequest();
        }

        [HttpPost("StartCheckoutServices")]
        public async Task<IActionResult> CheckoutServices(OrderServicesModelRequest model)
        {
            var result = await _unitOfWork.OrderRepository.StartCheckoutServices(
                model.ServiceId,
                model.CustomerId!,
                model.PetId,
                model.PaymentMethod,
                model.bookingDateTime,
                 null
                );
            if (result) return Ok("Booking Successfully! Please wait staff for accepting!");
            return BadRequest("Something went wrong!!!");
        }


        [HttpPost("StartCheckoutProduct")]
        public async Task<IActionResult> StartcheckoutProduct(OrderProductModelRequest model)
        {
            const string idAdminAuto = "fee3ede4-5aa2-484b-bc12-7cdc4d9437ac";
            if (model != null)
            {
                var result = await _unitOfWork.OrderRepository.StartCheckoutProduct(model.CustomerId, idAdminAuto, model.PaymentMethod, model.VoucherId, model.DeliveryOption);
                if (result) return Ok("Booking Successfully! Please wait staff for accepting!");
                return BadRequest("Something went wrong!!");
            }
            return BadRequest("Cracking...Please comeback latter");
        }
        [HttpGet("ResponeCheckOut")]
        public async Task<IActionResult> ResponseCheckOut()
        {
            const string HomePageUrl = "http://localhost:5173/payment-success";
            const string ReturnUrl = "http://localhost:5173/404";
            string method = Request.Query["method"];
            string orderId = Request.Query["orderId"];

            if (string.IsNullOrEmpty(method) || string.IsNullOrEmpty(orderId))
            {
                return BadRequest("Payment not specified");
            }
            var checkRepsone = false;
            switch (method)
            {
                case "VNPAY":
                    var responeVnPay = _vnpayServices.PayymentExecute(Request.Query);
                    if (responeVnPay == null || responeVnPay.VnPayResponseCode != "00") return BadRequest();
                    checkRepsone = true;
                    break;
                case "PAYPAL":
                    var paymentId = Request.Query["paymentId"];
                    var payerId = Request.Query["payerId"];
                    var paypalResponse =  _payPalServices.ExecutePayment(paymentId, payerId);
                    if (paypalResponse == null) return BadRequest();
                    checkRepsone = true;
                    break;
            }
            if (checkRepsone == true)
            {
                Boolean result = false;
                if (orderId.StartsWith("ORP"))
                {
                    result = await _unitOfWork.OrderRepository.AfterCheckOutProduct(orderId);
                }
                else if (orderId.StartsWith("ORS"))
                {
                    if (!_unitOfWork.productOrderDetailRepository.getByOrderIdOnly(orderId).Result.IsNullOrEmpty())
                        result = await _unitOfWork.OrderRepository.AfterCheckOutServiceAddMoreProduct(orderId);
                    else result = await _unitOfWork.OrderRepository.AfterCheckOutService(orderId);
                }
                    if (result == true) return Redirect(HomePageUrl);
            }
            return Redirect(ReturnUrl);
        }

        [HttpGet("GetAllOrderService")]
        public async Task<IActionResult> getAllService()
        {
            IEnumerable<Order> list = (await _unitOfWork.OrderGenericRepo.GetAll()).Where(x => x.OrderId.StartsWith("ORS"));
            if(list != null)
            {
                return Ok(list);
            }else return NotFound();
        }

        [HttpGet("GetAllOrderProduct")]
        public async Task<IActionResult> getAllProduct()
        {
            IEnumerable<Order> list = (await _unitOfWork.OrderGenericRepo.GetAll()).Where(x => x.OrderId.StartsWith("ORP"));
            if (list != null)
            {
                return Ok(list);
            }
            else return NotFound();
        }

        [HttpPut("UpdateOrderStatus")]
        public async Task<IActionResult> UpdateOrderStatus(string OrderId, string status)
        {

            var order = _unitOfWork.OrderGenericRepo.GetById(OrderId);
            if(order.Status == 0)
            {
                var (success, staff) = await _staffServices.AssignAvailableStaffToOrder(OrderId);
                if (!success)
                {
                    return BadRequest("Không có nhân viên rảnh rỗi hoặc đơn hàng không tồn tại.");
                }
            }
            if (order != null)
            {
                var result = await _unitOfWork.OrderRepository.UpdateOrderStatus(OrderId, status);

                if (result == true) 
               
                {
                    await _staffServices.UpdateStaffStatusBasedOnOrder(OrderId);

                }
                return Ok();

            }


            return BadRequest("Something went wrong!!!");
        }
        [HttpDelete("DeleteOrderByOrderId")]
        public async Task<IActionResult> DeleteOrder(string orderId)
        {
            var order = _unitOfWork.OrderGenericRepo.GetById(orderId);
            if (order != null)
            {
                 var result = await _unitOfWork.OrderRepository.DeleteOrderByOrderId(orderId);
                if (result == true) return Ok();
            }
            return BadRequest();
        }
        [HttpPost("AddONEProductToServicesBooking")]
        public async Task<IActionResult> AddOneProduct(string orderId, string productId, int quanity, double discount)
        {
            if(orderId != null && productId != null)
            {
               var result = await _unitOfWork.OrderRepository.AddOneProductToServiceBooking(orderId, productId, quanity, discount);
                if (result == true) return Ok($"Add more Product To {orderId} successfully!!!");
            }
            return BadRequest();
        }

        [HttpPost("AddMANYProductToServicesBooking")]
        public async Task<IActionResult> AddMoreProduct(string orderId,[FromBody] List<ProductDetailRequestAddMore> models)
        {
            if (orderId != null && !models.IsNullOrEmpty())
            {
                var result = await _unitOfWork.OrderRepository.AddManyProductToServiceBooking(orderId, models);
                if (result != null) return Ok(result);
            }
            return BadRequest();
        }

        [HttpPut("ReBooking")]
        public async Task<IActionResult> ReBooking(string orderId)
        {
            if(orderId != null)
            {
                var result = await _unitOfWork.OrderRepository.ReOrder(orderId);
                if(result != null) return Ok(result);
            }
            return BadRequest();    
        }

        [HttpPut("CheckInSerivces")]
        public async Task<IActionResult> checkInService(string orderId)
        {
            if(orderId != null)
            {
                var check = await  _unitOfWork.OrderRepository.CheckInService(orderId);
                if(check) return Ok("Check-In Successfully");
            }
            return BadRequest();
        }

        [HttpPut("UpdateStatusForOrderProduct")]
        public async Task<IActionResult> updateStatusForOrderProduct([FromQuery]string orderId, string Status)
        {
            if(orderId != null && Status != null)
            {
                var result = await _unitOfWork.OrderRepository.UpdateProductOrderStatus(orderId, Status);
                if(result == true) return Ok("Update successfully");
            }
            return BadRequest();
        }

        [HttpPut("UserAcceptedProductDelivered")]
        public async Task<IActionResult> UserAcceptedProductDelivered([FromQuery] string orderId, string Status)
        {
            if (orderId != null && Status != null)
            {
                var result = await _unitOfWork.OrderRepository.UpdateProductOrderStatusByUser(orderId, Status);
                if (result == true) return Ok("Update successfully");
            }
            return BadRequest();
        }

    }
}
