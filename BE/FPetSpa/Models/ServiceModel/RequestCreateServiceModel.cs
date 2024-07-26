namespace FPetSpa.Models.ServiceModel
{
    public class RequestCreateServiceModel
    {
       public string Id { get; set; }

        public string? ServiceName { get; set; } = null!;

        public string? Description { get; set; } = null!;

        public decimal? Price { get; set; } = null!;
        public IFormFile? file { get; set; } = null!;
    }
   
}
