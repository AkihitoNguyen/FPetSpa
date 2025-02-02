        
using FPetSpa.Repository;

using FPetSpa.Repository.Data;
using FPetSpa.Models.ProductModel;


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static FPetSpa.Models.ProductModel.RequestSearchProductModel;
using System.Linq.Expressions;
using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Authorization;
using System.Configuration;
using FPetSpa.Repository.Model.ProductOrderDetailModel;
using FPetSpa.Models.ServiceModel;
using Hangfire.Logging.LogProviders;


namespace FPetSpa.Controllers
{

    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProducService _productService;
        private readonly ImageController _imageController;

        public ProductController(IUnitOfWork unitOfWork, IProducService service, ImageController image)
        {
            _unitOfWork = unitOfWork;
            _productService = service;
            _imageController = image;
        }


        [HttpGet]
        public async Task<IActionResult> SearchProduct([FromQuery] RequestSearchProductModel requestSearchProductModel)
        {
            var sortBy = requestSearchProductModel.SortContent != null ? requestSearchProductModel.SortContent?.sortProductBy.ToString() : null;
            var sortType = requestSearchProductModel.SortContent != null ? requestSearchProductModel.SortContent?.sortProductType.ToString() : null;
            Expression<Func<Product, bool>> filter = x =>
                (string.IsNullOrEmpty(requestSearchProductModel.ProductName) || x.ProductName.Contains(requestSearchProductModel.ProductName)) &&
                (x.CategoryId == requestSearchProductModel.CategoryId || requestSearchProductModel.CategoryId == null) &&
                x.Price >= requestSearchProductModel.FromPrice &&
                (x.Price <= requestSearchProductModel.ToPrice || requestSearchProductModel.ToPrice == null);
            Func<IQueryable<Product>, IOrderedQueryable<Product>> orderBy = null;

            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortType == SortProductTypeEnum.Ascending.ToString())
                {
                    orderBy = query => query.OrderBy(p => EF.Property<object>(p, sortBy));
                }
                else if (sortType == SortProductTypeEnum.Descending.ToString())
                {
                    orderBy = query => query.OrderByDescending(p => EF.Property<object>(p, sortBy));
                }
            }
            var responseCategorie = _unitOfWork.ProductRepository.Get(
                filter,
                orderBy,
                includeProperties: "",
                pageIndex: requestSearchProductModel.pageIndex,
                pageSize: requestSearchProductModel.pageSize
            );
            var categoryDictionary = _unitOfWork.CategoryRepository.Get().ToDictionary(c => c.CategoryId, c => c.CategoryName);
            var resultTask = responseCategorie.Select( async p => new ResponseProductSearchModel
            {
                ProductId = p.ProductId,
                ProductName = p.ProductName!,
                ProductDescription = p.ProductDescription!,
                CategoryName = categoryDictionary.TryGetValue(p.CategoryId, out var categoryName)? categoryName : null,
                PictureName =  await _imageController.GetLinkByName("productfpetspa", p.PictureName!),
                Price = p.Price,
                ProductQuantity = p.ProductQuantity
            });

            var result = await Task.WhenAll(resultTask);

            if(requestSearchProductModel.CategoryName != null)
            {
                return Ok(result.Where(c => c.CategoryName == requestSearchProductModel.CategoryName));
            }    

            return Ok(result);
        }

        [HttpGet("SearchById")]
        public async Task<ActionResult> GetProductById(string id)
        {
            var responseCategories = _unitOfWork.ProductRepository.GetById(id);
            if(responseCategories != null)
            {
                var result = new ResponseProductSearchModel
                {
                    ProductId = responseCategories.ProductId,
                    PictureName = await _imageController.GetLinkByName("productfpetspa", responseCategories.PictureName!),
                    Price = responseCategories.Price,
                    ProductQuantity = responseCategories.ProductQuantity,
                    ProductDescription = responseCategories.ProductDescription,
                    ProductName = responseCategories.ProductName!,
                    CategoryName = _unitOfWork.CategoryRepository.GetById(responseCategories.CategoryId!).CategoryName!

                };
                return Ok(result);  
            }
            return BadRequest();
        }

        [HttpPost("Create-Product")]
       // [Authorize]
        public async Task<IActionResult> CreateProduct(RequestCreateProductModel requestCreateProductModel)
        {
            var newProductId = await _productService.GenerateNewProductIdAsync();

            var checkImageUpload = await _imageController.UploadFileAsync(requestCreateProductModel.file, "productfpetspa", null);
            if (checkImageUpload != null)
            {
                var productEntity = new Product

                {
                    ProductId = newProductId,
                    ProductName = requestCreateProductModel.ProductName,
                    PictureName = requestCreateProductModel.file.FileName,
                    CategoryId = requestCreateProductModel.CategoryID,
                    ProductQuantity = requestCreateProductModel.ProductQuantity,
                    ProductDescription = requestCreateProductModel.ProductDescription,
                    Price = requestCreateProductModel.Price,
                };

                _unitOfWork.ProductRepository.Insert(productEntity);
                _unitOfWork.Save();
                return Ok();
            }
            return BadRequest("Can't upload image");
            }
        
        [HttpPut("{id}")]
        //[Authorize]
        public async Task<IActionResult> UpdateProduct(string id, RequestUpdateProductModel requestCreateProductModel)
        {
            var existedProductEntity = _unitOfWork.ProductRepository.GetById(id);
            if (existedProductEntity != null)
            {
                if(requestCreateProductModel.file != null)
                {
                    await _imageController.DeleteFileAsync("productfpetspa", existedProductEntity.PictureName!);
                    await _imageController.UploadFileAsync(requestCreateProductModel.file, "productfpetspa", null);
                    existedProductEntity.PictureName = requestCreateProductModel.file.FileName;
                }
                if (requestCreateProductModel.ProductQuantity != null)
                existedProductEntity.ProductQuantity = requestCreateProductModel.ProductQuantity;
                if(requestCreateProductModel.Price != null)
                existedProductEntity.Price = requestCreateProductModel.Price;
                _unitOfWork.ProductRepository.Update(existedProductEntity);
                _unitOfWork.Save();
            }
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var existedCategoryEntity = _unitOfWork.ProductRepository.GetById(id);
            if (existedCategoryEntity != null)
            {
                await _imageController.DeleteFileAsync("productfpetspa", existedCategoryEntity.ProductName!);
                _unitOfWork.ProductRepository.Delete(existedCategoryEntity);
                _unitOfWork.Save();
                return Ok();
            }
            return BadRequest();
        }

    }
}
