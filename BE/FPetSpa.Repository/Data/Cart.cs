using System.Text.Json.Serialization;

namespace FPetSpa.Repository.Data;

public partial class Cart
{
    public string CartId { get; set; } = null!;

    public string? UserId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual User? User { get; set; }
    [JsonIgnore]
    public virtual ICollection<CartDetail> CartDetails { get; set; } = new List<CartDetail>(); // Navigation property
}
