namespace FPetSpa.Models.CategoryModel
{
    public class RequestCreateCategoryModel
    {
        public string CategoryId { get; set; } = null!;

        public string? CategoryName { get; set; }

        public string? Description { get; set; }
    }
}
