namespace FPetSpa.Repository.Model.ServiceOrderDetailModel
{
    public class RequestCreateServiceOrderDetail
    {
        public string? ServiceId { get; set; }

        public string OrderId { get; set; }

        public double? Discount { get; set; }

        public decimal? PetWeight { get; set; }

        public decimal? Price { get; set; }

        public string? PetId { get; set; }
    }
}
