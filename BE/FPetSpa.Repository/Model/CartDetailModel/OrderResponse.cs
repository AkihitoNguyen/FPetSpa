using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.OrderModel
{
    public class OrderResponse
    {
        public String Date { get; set; }
        public int OrderCount { get; set; }
        public int ProductCount { get; set; }
        public decimal TotalAmount { get; set; }
    }
    public class OrderStatistics
    {
        public DateTime Date { get; set; }
        public int TotalOrders { get; set; }
        public int SuccessfulOrders { get; set; }
        public int FailedOrders { get; set; }
    }
}