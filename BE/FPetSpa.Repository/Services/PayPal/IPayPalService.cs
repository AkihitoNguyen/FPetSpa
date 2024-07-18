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
        public PayPalBalanceResponse GetTransactions(DateTime? startDate = null, DateTime? endDate = null);
        public List<Object> transacitonList(int count = 10,
            string startId = null,
            decimal? minAmount = null,
            decimal? maxAmount = null,
            string startDate = null,
            string endDate = null,
            int? month = null,
            int? year = null);


    }
}
