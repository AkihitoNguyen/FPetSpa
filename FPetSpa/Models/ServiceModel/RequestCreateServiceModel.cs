namespace FPetSpa.Models.ServiceModel
{
    public class RequestCreateServiceModel
    {
        public string ServiceId { get; set; } = null!;

        public string? PictureName { get; set; }

        public string? ServiceName { get; set; }

        public decimal? MinWeight { get; set; }

        public decimal? MaxWeight { get; set; }

        public string? Description { get; set; }

        public decimal? Price { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? Status { get; set; }
    }
}
