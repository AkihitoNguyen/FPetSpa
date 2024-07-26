namespace FPetSpa.Repository.Data;

public partial class Pet
{
    public string PetId { get; set; }

    public string? CustomerId { get; set; }

    public string? PetName { get; set; }

    public string? PictureName { get; set; }

    public int? TypeId { get; set; }

    public decimal? PetWeight { get; set; }

    public virtual User? Customer { get; set; }

    public virtual PetType? PetType { get; set; } 
}
