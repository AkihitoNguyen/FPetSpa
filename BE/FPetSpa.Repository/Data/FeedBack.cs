namespace FPetSpa.Repository.Data;

public partial class FeedBack
{
    public int Id {  get; set; }
    public string? UserFeedBackId { get; set; }

    public string? ProductId { get; set; }

    public string? PictureName { get; set; }

    public int? Star { get; set; }

    public string? Description { get; set; }

    public virtual Product? product { get; set; }

    public virtual User? UserFeedBack { get; set; }
}
