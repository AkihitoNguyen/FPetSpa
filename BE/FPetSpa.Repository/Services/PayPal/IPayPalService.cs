using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services.PayPal
{
    public interface IPayPalService
    {
        public Task<string> GetAccessTokenAsync();
        public Task<PayPalPaymentResponse> CreatePaymentAsync(PaymentRequest paymentRequest);
        public Task<PayPalPaymentResponse> ExecutePaymentAsync(string paymentId, string payerId);

    }
}
