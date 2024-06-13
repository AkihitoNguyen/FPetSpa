using System;
using System.Collections.Generic;

namespace FPetSpa.Repository.Data;

public partial class ServiceOrderDetail
{
    public string? ServiceId { get; set; }

    public string? OrderId { get; set; }

    public double? Discount { get; set; }

    public decimal? PetWeight { get; set; }

    public decimal? Price { get; set; }

    public string? PetId { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Pet? Pet { get; set; }

    public virtual Service? Service { get; set; }
}
