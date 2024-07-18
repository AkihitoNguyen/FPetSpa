using FPetSpa.Repository.Data;

namespace FPetSpa.Models.FeedBackModel
{
    public class RequestSearchFeedBackModel
    {
        public string? UserFeedBackId { get; set; }
        public SortContent? SortContent { get; set; }
        public decimal? FromStar { get; set; } = decimal.Zero;
        public decimal? ToStar { get; set; } = null;
        public int pageIndex { get; set; } = 1;
        public int pageSize { get; set; } = 10;

    }
    public class SortContent
    {
        public SortFeedbackByEnum sortFeedBackBy { get; set; }
        public SortFeedbackTypeEnum sortFeedBackType { get; set; }
    }

    public enum SortFeedbackByEnum
    {
        UserFeedBackId = 1,
        Star = 2,

    }
    public enum SortFeedbackTypeEnum
    {
        Ascending = 1,
        Descending = 2,
    }
}
