namespace FPetSpa.Models.OrderModel
{
    public class RequestSearchOrderModel
    {
        public string? OrderStatus {  get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? TransactionStatus { get; set; }
        public string? OrderId {  get; set; }
        public string? CustomeriD { get; set; }
        public string? DeliveryOption {  get; set; }
    }
}
