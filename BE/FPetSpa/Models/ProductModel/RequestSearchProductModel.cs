using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace FPetSpa.Models.ProductModel
{
    public class RequestSearchProductModel 
    {
        public string? ProductName { get; set; }
        public string? CategoryId { get; set; }
        public decimal? FromPrice { get; set; } = decimal.Zero;
        public decimal? ToPrice { get; set; } = null;
        public SortContent? SortContent { get; set; }
        public int pageIndex { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? CategoryName { get; set; }
    }
    public class SortContent
    {
        public SortProductByEnum sortProductBy { get; set; }
        public SortProductTypeEnum sortProductType { get; set; }
    }

    public enum SortProductByEnum
    {
        ProductId = 1,
        ProductName = 2,
        CategoryId = 3,
        ProductQuantity = 4,
        Price = 5,
    }
    public enum SortProductTypeEnum
    {
        Ascending = 1,
        Descending = 2,
    }
}
