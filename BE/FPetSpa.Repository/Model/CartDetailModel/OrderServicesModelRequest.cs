using System.ComponentModel.DataAnnotations;

namespace FPetSpa.Repository.Model.OrderModel
{
    public class OrderServicesModelRequest
    {
        public string? CustomerId { get; set; }
        public string PetId { get; set; }
        public string ServiceId { get; set; }
        public string PaymentMethod { get; set; }
        [Required]
        public DateTime bookingDateTime { get; set; }
    }
}
