namespace FPetSpa.Repository.Model.ProductOrderDetailModel
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
