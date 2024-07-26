using FPetSpa.Repository.Data;

namespace FPetSpa.Models.OrderModel
{
    public class ResponseSearchOrderModel
    {
        public string OrderId { get; set; } = null!;
        public string? CustomerId { get; set; }
        public DateTime? RequiredDate { get; set; }
        public DateTime? BookingTime { get; set; } = null;
        public decimal? Total { get; set; }
        public string? VoucherId { get; set; }
        public byte Status { get; set; }
        public int TransactionStatus { get; set; }
        public string DeliveryOption {  get; set; }
    }
    public class ResponseSearchModelCustom
    {
        public string ServicesId { get; set; }
        public string ServiceName { get; set; }
        public string PictureServices { get; set; }
        public DateOnly? TransactionDate { get; set; }
        public DateTime? BookingTime { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}
