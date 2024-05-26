using System;
using System.Collections.Generic;

namespace FPetSpa.Data;

public partial class PaymentMethod
{
    public int MethodId { get; set; }

    public string? MethodName { get; set; }

    public string? MethodApi { get; set; }

    public double? Tax { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
