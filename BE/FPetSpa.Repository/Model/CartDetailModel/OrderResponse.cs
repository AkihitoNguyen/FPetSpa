using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.OrderModel
{
    public class OrderResponse
    {
        public string OrderId { get; set; }
        public DateTime? RequiredDate { get; set; }
        public decimal? Total { get; set; }
    }
}
