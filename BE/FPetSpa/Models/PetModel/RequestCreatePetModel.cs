namespace FPetSpa.Models.PetModel
{
    public class RequestCreatePetModel
    {

        public string? CustomerId { get; set; }

        public string? PetName { get; set; }

        public IFormFile? file { get; set; } = null;

        public int? PetType { get; set; }

        public decimal? PetWeight { get; set; }
    }
}
