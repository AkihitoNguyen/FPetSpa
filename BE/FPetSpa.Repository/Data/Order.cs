using System;
using System.Collections.Generic;

namespace FPetSpa.Repository.Data;

public partial class Order
{
    public string OrderId { get; set; } = null!;

    public string? CustomerId { get; set; }

    public int? StaffId { get; set; }

    public DateOnly? RequiredDate { get; set; }

    public decimal? Total { get; set; }

    public string? VoucherId { get; set; }

    public string? TransactionId { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<FeedBack> FeedBacks { get; set; } = new List<FeedBack>();

    public virtual Staff? Staff { get; set; }

    public virtual Transaction? Transaction { get; set; }

    public virtual Voucher? Voucher { get; set; }
}
