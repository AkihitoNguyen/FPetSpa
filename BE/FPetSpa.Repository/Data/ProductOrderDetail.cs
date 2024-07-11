namespace FPetSpa.Repository.Data;

public partial class ProductOrderDetail
{
    public string? OrderId { get; set; }

    public string? ProductId { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }

    public double? Discount { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Product? Product { get; set; }
}
