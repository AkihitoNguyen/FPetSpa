using System;
using System.Collections.Generic;

namespace FPetSpa.Data;

public partial class Transaction
{
    public string TransactionId { get; set; } = null!;

    public int? Status { get; set; }

    public DateOnly? TransactionDate { get; set; }

    public int? MethodId { get; set; }

    public virtual PaymentMethod? Method { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
