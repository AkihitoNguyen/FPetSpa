namespace FPetSpa.Model.ServiceModel
{

    public class RequestSearchServiceModel
    {
        public string? ServiceName { get; set; }
        public int? CategoryId { get; set; }
        public decimal? FromUnitPrice { get; set; } = null;
        public decimal? ToUnitPrice { get; set; } = null;
        public SortContent? SortContent { get; set; }
        public int pageIndex { get; set; } = 1;
        public int pageSize { get; set; } = 10;

    }
    public class SortContent
    {
        public SortServiceByEnum sortServiceBy { get; set; }
        public SortServiceTypeEnum sortServiceType { get; set; }
    }

    public enum SortServiceByEnum
    {
        ServiceId = 1,
        ServiceName = 2,
        CategoryId = 3,
        UnitsInStock = 4,
        UnitPrice = 5,
    }
    public enum SortServiceTypeEnum
    {
        Ascending = 1,
        Descending = 2,
    }

}
