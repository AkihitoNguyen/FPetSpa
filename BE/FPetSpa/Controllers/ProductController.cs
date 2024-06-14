
﻿using FPetSpa.Repository;

﻿using FPetSpa.Repository.Data;
using FPetSpa.Models.ProductModel;


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static FPetSpa.Models.ProductModel.RequestSearchProductModel;
using System.Linq.Expressions;
using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Authorization;

namespace FPetSpa.Controllers
{

    [Route("api/products")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IProducService _productService;


        public ProductController(UnitOfWork unitOfWork, IProducService service)
        {
            _unitOfWork = unitOfWork;
            _productService = service;
        }

        /// <summary>
        /// SortBy (ProductId = 1,ProductName = 2,CategoryId = 3,ProductQuantity = 4,Price = 5,)
        /// 
        /// SortType (Ascending = 1,Descending = 2,)        
        /// </summary>
        /// <param name="requestSearchProductModel"></param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult SearchProduct([FromQuery] RequestSearchProductModel requestSearchProductModel)
        {
            var sortBy = requestSearchProductModel.SortContent?.sortProductBy.ToString();
            var sortType = requestSearchProductModel.SortContent?.sortProductType.ToString();

            Expression<Func<Product, bool>> filter = x =>
                (string.IsNullOrEmpty(requestSearchProductModel.ProductName) || x.ProductName.ToLower().Contains(requestSearchProductModel.ProductName.ToLower())) &&
                (requestSearchProductModel.CategoryId == null || x.CategoryId == requestSearchProductModel.CategoryId) &&
                (requestSearchProductModel.FromPrice == null || x.Price >= requestSearchProductModel.FromPrice) &&
                (requestSearchProductModel.ToPrice == null || x.Price <= requestSearchProductModel.ToPrice);

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

            var responseProducts = _unitOfWork.ProductRepository.Get(
                filter,
                orderBy,
                includeProperties: "",
                pageIndex: requestSearchProductModel.pageIndex,
                pageSize: requestSearchProductModel.pageSize
            );

            return Ok(responseProducts);
        }


        [HttpGet("{id}")]
        [Authorize]

        public IActionResult GetProductById(string id)
        {
            var responseCategories = _unitOfWork.ProductRepository.GetById(id);
            return Ok(responseCategories);
        }
        
        [HttpPost]
        [Authorize]
         public async Task<IActionResult> CreateProduct(RequestCreateProductModel requestCreateProductModel)
        {
            var newProductId = await _productService.GenerateNewProductIdAsync();
            var productEntity = new Product

            {
                ProductId = newProductId,
                ProductName = requestCreateProductModel.ProductName,
                PictureName = requestCreateProductModel.PictureName,
                CategoryId = requestCreateProductModel.CategoryID,
                ProductQuantity = requestCreateProductModel.ProductQuantity,
                ProductDescription = requestCreateProductModel.ProductDescription,
                Price = requestCreateProductModel.Price,
        };
              _unitOfWork.ProductRepository.Insert(productEntity);
            _unitOfWork.Save();
            return Ok();
    }
    [HttpPut("{id}")]
        [Authorize]


        public IActionResult UpdateProduct(string id, RequestCreateProductModel requestCreateProductModel)
        {
            var existedProductEntity = _unitOfWork.ProductRepository.GetById(id);
            if (existedProductEntity != null)
            {
                existedProductEntity.ProductName = requestCreateProductModel.ProductName;
                existedProductEntity.PictureName = requestCreateProductModel.PictureName;
                existedProductEntity.CategoryId = requestCreateProductModel.CategoryID;
                existedProductEntity.ProductQuantity = requestCreateProductModel.ProductQuantity;
                existedProductEntity.ProductDescription = requestCreateProductModel.ProductDescription;

                existedProductEntity.Price = requestCreateProductModel.Price;

            }
            _unitOfWork.ProductRepository.Update(existedProductEntity);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(string id)
        {
            var existedCategoryEntity = _unitOfWork.ProductRepository.GetById(id);
            _unitOfWork.ProductRepository.Delete(existedCategoryEntity);
            _unitOfWork.Save();
            return Ok();
        }

    }
}
