using System.Text.Json.Serialization;

namespace FPetSpa.Repository.Data;

public partial class Transaction
{
    public string TransactionId { get; set; } = null!;

    public int Status { get; set; }

    public DateOnly? TransactionDate { get; set; }

    public int? MethodId { get; set; }

    public virtual PaymentMethod? Method { get; set; }

    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
