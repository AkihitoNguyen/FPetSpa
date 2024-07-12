using FPetSpa.Models.CategoryModel;
using FPetSpa.Models.ServiceModel;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public CategoriesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllCategories()
        {
            var categories = await _unitOfWork.CategoryRepository.GetAll();
            if (categories == null)
            {
                return NotFound();
            }
            return Ok(categories);
        }
        [HttpGet("{id}")]
        public ActionResult GetCategoryById(string id)
        {
            var category = _unitOfWork.CategoryRepository.GetById(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
        [HttpPost]
        public async Task<ActionResult> CreateCategory(RequestCreateCategoryModel requestCreateCategoryModel)
        {
            var category = new Category
            {
                CategoryId = requestCreateCategoryModel.CategoryId,
                CategoryName = requestCreateCategoryModel.CategoryName,
                Description = requestCreateCategoryModel.Description,
            };
            _unitOfWork.CategoryRepository.Insert(category);
            _unitOfWork.Save();
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(String id, RequestCreateCategoryModel requestCreateCategoryModel)
        {
            var existedCategoryEntity = _unitOfWork.CategoryRepository.GetById(id);
            if (existedCategoryEntity != null)
            {
                existedCategoryEntity.CategoryId = requestCreateCategoryModel.CategoryId;
                existedCategoryEntity.CategoryName = requestCreateCategoryModel.CategoryName;
                existedCategoryEntity.Description = requestCreateCategoryModel.Description;
            }
            _unitOfWork.CategoryRepository.Update(existedCategoryEntity);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(String id)
        {
            var existedCategoryEntity = _unitOfWork.CategoryRepository.GetById(id);
            _unitOfWork.CategoryRepository.Delete(existedCategoryEntity);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
