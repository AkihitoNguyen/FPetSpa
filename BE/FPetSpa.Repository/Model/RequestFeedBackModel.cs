using FPetSpa.Repository.Data;

namespace FPetSpa.Models.FeedBackModel
{
    public class RequestFeedBackModel
    {
        public string? UserFeedBackId { get; set; }

        public string? ProductId { get; set; }

        public string? PictureName { get; set; }

        public int? Star { get; set; }

        public string? Description { get; set; }
    }
}
