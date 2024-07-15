using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.VnPayModel
{
    public class VnPayBalanceResponse
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public decimal TotalIn { get; set; }
        public decimal TotalOut { get; set; }
    }

    public class BalanceData
    {
        public decimal ReceivedAmount { get; set; }
        public decimal CurrentBalance { get; set; }
    }
}
