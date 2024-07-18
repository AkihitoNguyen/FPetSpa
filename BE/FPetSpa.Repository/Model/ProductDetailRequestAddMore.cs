using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model
{
    public class ProductDetailRequestAddMore
    {
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public double Discount { get; set; }
    }
}
