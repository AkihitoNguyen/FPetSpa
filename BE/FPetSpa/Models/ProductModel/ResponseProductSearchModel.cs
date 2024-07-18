namespace FPetSpa.Models.ProductModel
{
    public class ResponseProductSearchModel
    {
        public string ProductId { get; set; } = null!;

        public string ProductName { get; set; }

        public string PictureName { get; set; }

        public string CategoryName { get; set; }

        public string ProductDescription { get; set; }

        public int? ProductQuantity { get; set; }

        public decimal? Price { get; set; }

    }
}
