using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.PayPalModel
{
    public class PayPalPaymentResponse
    {
        public string PaymentId { get; set; }
        public string ApprovalUrl { get; set; }
    }

}
