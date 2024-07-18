using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.PayPalModel
{
    public class PayPalPaymentRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        //  public string ReturnUrl { get; set; }
        // public string CancelUrl { get; set; }
    }


    public class PayPalBalanceRequest
    {
        public DateTime? StartDate { get; set; } = null!;
        public DateTime? EndDate { get; set;} = null!;  
    }

}
