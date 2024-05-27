using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FPetSpa.Data;

public partial class Product
{
    public string ProductId { get; set; } = null!;

    public string? ProductName { get; set; }

    public string? PictureName { get; set; }


    public string? CategoryId { get; set; }

    public string? ProductDescription { get; set; }

    public int? ProductQuantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Category? Category { get; set; }
}
