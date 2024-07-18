namespace FPetSpa.Repository.Data;

public partial class Voucher
{
    public string VoucherId { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
