using FPetSpa.Repository.Data;
using System.ComponentModel.DataAnnotations;

namespace FPetSpa.Models.ProductOrderDetailModel
{
    public class RequestCreateProductOrderDetail
    {



        public string? OrderId { get; set; }

        public string? ProductId { get; set; }

        public int? Quantity { get; set; }

        public decimal? Price { get; set; }

        public double? Discount { get; set; }




    }
}
