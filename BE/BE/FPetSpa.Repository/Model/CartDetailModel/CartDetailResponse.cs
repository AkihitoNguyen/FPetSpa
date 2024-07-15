using FPetSpa.Repository.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.CartDetailModel
{
    public class CartDetailResponse
    {
        public string? CartId { get; set; }

        public string? ProductId { get; set; }
        public string ProductName { get; set; }

        public int? Quantity { get; set; }

        public decimal? Price { get; set; }

        public string PictureName { get; set; }

    }

}
