namespace FPetSpa.Models.PetModel
{
    public class RequestCreatePetModel
    {

        public string? CustomerId { get; set; }

        public string? PetName { get; set; }

        public string? PictureName { get; set; }

        public string? PetGender { get; set; }

        public string? PetType { get; set; }

        public decimal? PetWeight { get; set; }
    }
}
