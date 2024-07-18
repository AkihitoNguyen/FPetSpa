namespace FPetSpa.Models.ProductModel
{
    public class RequestCreateProductModel
    {

        public string ProductName { get; set; }
        public string CategoryID { get; set; }
        public string ProductDescription { get; set; }
        public int ProductQuantity{ get; set; }
        public decimal Price { get; set; }
        public IFormFile file { get; set; }
    }
}
