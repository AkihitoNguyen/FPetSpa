using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Services.VnPay;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnpayServices;

        public PaymentController(IVnPayService payService)
        {
            _vnpayServices = payService;
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
   
    }

    
}
