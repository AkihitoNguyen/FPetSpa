using System.Text.Json.Serialization;

namespace FPetSpa.Repository.Data;

public partial class Order
{
    public string OrderId { get; set; } = null!;
    public string? CustomerId { get; set; }
    public string? StaffId { get; set; }
    public DateTime? RequiredDate { get; set; }
    public decimal? Total { get; set; }
    public string? VoucherId { get; set; }
    public string? TransactionId { get; set; }
    public byte Status { get; set; }
    public virtual User? Customer { get; set; }

    public virtual User? Staff1 { get; set; }

    [JsonIgnore]
    public virtual Transaction? Transaction { get; set; }

    public virtual Voucher? Voucher { get; set; }

    [JsonIgnore]
    public ICollection<ProductOrderDetail> ProductOrderDetails { get; set; }

}
