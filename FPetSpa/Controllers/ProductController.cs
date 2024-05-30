
﻿using FPetSpa.Repository;

﻿using FPetSpa.Data;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository;

using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{

    [Route("api/products")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly UnitOfWork _unitOfWork;
        public ProductController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _unitOfWork.ProductRepository.GetAll();
            return Ok(result);
        }


        [HttpGet("{id}")]
        public IActionResult GetProductById(string id)
        {
            var responseCategories = _unitOfWork.ProductRepository.GetById(id);
            return Ok(responseCategories);
        }
        [HttpPost]
        public IActionResult CreateProduct(RequestCreateProductModel requestCreateProductModel)
        {
            var productEntity = new Product
            {
                ProductId = requestCreateProductModel.ProductId,

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
