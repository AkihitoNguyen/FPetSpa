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
    public class DashboardData
    {
        public string CustomerName { get; set; }
        public decimal? Total { get; set; }
        public DateTime? TransactionDate { get; set; }
        public string PaymentMethod { get; set; }
        public string StaffName { get; set; }
        public byte? Status { get; set; }
    }
}