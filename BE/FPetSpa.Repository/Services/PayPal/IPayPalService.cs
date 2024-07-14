using FPetSpa.Repository.Model.PayPalModel;
using Microsoft.AspNetCore.Http;
using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services.PayPal
{
    public interface IPayPalService
    {
        public PayPalPaymentResponse CreatePayment(PayPalPaymentRequest request, string RETURN_URL, string CANCEL_URL);
       public Payment ExecutePayment(string paymentId, string payerId);

    }
}
