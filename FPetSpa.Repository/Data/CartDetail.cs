using System;
using System.Collections.Generic;

namespace FPetSpa.Repository.Data;

public partial class CartDetail
{
    public string? CartId { get; set; }

    public string? ProductId { get; set; }

    public DateTime? Quantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual Product? Product { get; set; }
}
