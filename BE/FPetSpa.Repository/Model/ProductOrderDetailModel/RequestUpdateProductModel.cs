using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.ProductOrderDetailModel
{
    public class RequestUpdateProductModel
    {
        public int? ProductQuantity { get; set; } = null;
        public decimal? Price { get; set; } = null;
    }
}
