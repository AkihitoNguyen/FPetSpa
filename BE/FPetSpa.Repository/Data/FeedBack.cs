namespace FPetSpa.Repository.Data;

public partial class FeedBack
{
    public string? UserFeedBackId { get; set; }

    public string? OrderId { get; set; }

    public string? PictureName { get; set; }

    public int? Star { get; set; }

    public string? Description { get; set; }

    public virtual Order? Order { get; set; }

    public virtual User? UserFeedBack { get; set; }
}
