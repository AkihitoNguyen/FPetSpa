using FPetSpa.Repository.Data;

namespace FPetSpa.Models.OrderModel
{
    public class ResponseSearchOrderModel
    {
        public string OrderId { get; set; } = null!;
        public string? CustomerId { get; set; }
        public DateTime? RequiredDate { get; set; }
        public decimal? Total { get; set; }
        public string? VoucherId { get; set; }
        public byte Status { get; set; }
        public int TransactionStatus { get; set; }
    }
}
