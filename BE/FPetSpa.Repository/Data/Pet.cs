﻿namespace FPetSpa.Repository.Data;

public partial class Pet
{
    public string PetId { get; set; }

    public string? CustomerId { get; set; }

    public string? PetName { get; set; }

    public string? PictureName { get; set; }

    public string? PetType { get; set; }

    public decimal? PetWeight { get; set; }

    public virtual User? Customer { get; set; }
}
