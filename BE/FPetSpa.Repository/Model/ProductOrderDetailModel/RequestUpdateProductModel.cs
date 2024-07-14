using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.ProductOrderDetailModel
{
    public class RequestUpdateProductModel
    {
        public IFormFile? file {  get; set; } = null;
        public int? ProductQuantity { get; set; } = null;
        public decimal? Price { get; set; } = null;
    }
}
