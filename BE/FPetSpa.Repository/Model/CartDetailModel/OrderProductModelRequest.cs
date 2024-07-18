namespace FPetSpa.Repository.Model.OrderModel
{
    public class OrderProductModelRequest
    {
        public string CustomerId { get; set; }
        public string PaymentMethod { get; set; }
        public string? VoucherId { get; set; } = null;
        public string? DeliveryOption { get; set; } = null;
        public decimal? ShipCost { get; set; }
    }
}
