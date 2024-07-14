using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model.PayPalModel;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Services.PayPal;
using FPetSpa.Repository.Services.VnPay;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase 
    {

        private readonly IVnPayService _vnpayServices;
        private readonly IPayPalService _paypalServices;

        public PaymentController(IVnPayService payService, IPayPalService payPalService)
        {
            _vnpayServices = payService;
            _paypalServices = payPalService;
        }

        
        [HttpPost("VnPayPayment")]
        public async Task<IActionResult> CreatePayment(string OrderInfo, string OrderId, double Amount)
        {
            var vnPayModel = new VnPayRequestModel
            {
                Description = OrderInfo,
                OrderId = OrderId,
                Amount = Amount,
                CreatedDate = DateTime.Now,
                ExpiredDate = DateTime.Now.AddSeconds(30)
            };
            var paymentUrl =  _vnpayServices.CreatePaymentURl(vnPayModel, HttpContext);
            return  Ok(new { paymentUrl });
        }


        [HttpGet("Vnpaymentcallback")]
        public async Task<IActionResult> ResponseVnPayMent()
        {
            var respone = _vnpayServices.PayymentExecute(Request.Query);
            if (respone == null || respone.VnPayResponseCode != "00") return BadRequest();
            return Ok(respone);
        }


        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var balance = await _vnpayServices.GetVnPayBalanceAsync(startDate, endDate, HttpContext);
                return Ok(balance);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("create-payment")]
        public IActionResult CreatePayment([FromBody] PayPalPaymentRequest request)
        {
            var paymentResponse = _paypalServices.CreatePayment(request, null, null);
            return Ok(paymentResponse);
        }

        [HttpGet("execute-payment")]
        public async Task<IActionResult> ExecutePayment([FromQuery] string paymentId, [FromQuery] string payerId)
        {
            try
            {
                var executedPayment =  _paypalServices.ExecutePayment(paymentId, payerId);
                return Ok(executedPayment);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error executing payment: {ex.Message}");
            }
        }
    }

    
}
