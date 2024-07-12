namespace FPetSpa.Models.ProductOrderDetailModel
{
    public class ResponseProductOrderDetailModel
    {
        public string OrderId { get; set; } = null!;
        public string ProductId { get; set; } = null!;

        public string ProductName { get; set; }

        public string PictureName { get; set; }

        public int? ProductQuantity { get; set; }

        public decimal? Price { get; set; }
    }
}
