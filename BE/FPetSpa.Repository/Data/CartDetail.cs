namespace FPetSpa.Repository.Data;

public partial class CartDetail
{
    public string? CartId { get; set; }

    public string? ProductId { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual Product? Product { get; set; }
}
