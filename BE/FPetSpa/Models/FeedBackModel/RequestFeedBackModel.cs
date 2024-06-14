using FPetSpa.Repository.Data;

namespace FPetSpa.Models.FeedBackModel
{
    public class RequestFeedBackModel
    {
        public int FeedBackId { get; set; }

        public string OrderId { get; set; }

        public string PictureName { get; set; }

        public int Star { get; set; }

        public string Description { get; set; }

    }
}
