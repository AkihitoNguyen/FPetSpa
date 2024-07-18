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
<<<<<<< HEAD:BE/BE/FPetSpa.Repository/Model/CartDetailModel/OrderServicesModelRequest.cs
      //  public string VoucherId { get; set; }
=======
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa.Repository/Model/CartDetailModel/OrderServicesModelRequest.cs
    }
}
