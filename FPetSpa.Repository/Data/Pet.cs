using System;
using System.Collections.Generic;

namespace FPetSpa.Data;

public partial class Pet
{
    public int PetId { get; set; }

    public int? CustomerId { get; set; }

    public string? PetName { get; set; }

    public string? PictureName { get; set; }

    public string? PetGender { get; set; }

    public string? PetType { get; set; }

    public decimal? PetWeight { get; set; }

    public virtual Customer? Customer { get; set; }
}
