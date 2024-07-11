using FPetSpa.Repository.Helper;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository.Data;
using NuGet.Protocol.Core.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.CodeAnalysis;
using Azure.Core;
using FPetSpa.Repository.Model.ProductOrderDetailModel;
using FPetSpa.Models.ProductOrderDetailModel;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOrderDetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ImageController _image;

        public ProductOrderDetailController(IUnitOfWork unitOfWork, ImageController image)
        {
            _unitOfWork = unitOfWork;
            _image = image;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var productOrder = await _unitOfWork.productOrderDetailRepository.GetAllAsync();
            return Ok(productOrder);
        }

        [HttpGet("{orderId}&{productId}")]
        public async Task<IActionResult> GetByOrderId(string orderId, string productId)
        {
            var productOrderDetails = await _unitOfWork.productOrderDetailRepository.GetByOrderID(orderId, productId);

            return Ok(productOrderDetails);
        }
        [HttpGet("getOrderById")]
        public async Task<IActionResult> GetByOrderIdOnly(string orderId)
        {
            var order = await _unitOfWork.productOrderDetailRepository.getByOrderIdOnly(orderId);
            if (order != null)
            {
                var result = order.Select(async x => new ResponseProductOrderDetailModel
                { 
                    OrderId = x.OrderId!,
                    ProductId = x.ProductId!,
                    ProductName = _unitOfWork.ProductRepository.GetByIdAsync(x.ProductId!).Result.ProductName!,
                    PictureName = await _image.GetLinkByName("productfpetspa", _unitOfWork.ProductRepository.GetById(x.ProductId!).PictureName!),
                    Price = x.Price,
                    ProductQuantity = x.Quantity
                }
                ).ToList();
                return Ok(await Task.WhenAll(result));
            }
            return BadRequest();    
        }

        [HttpDelete("{orderId}&{productId}")]
        public async Task<IActionResult> DeleteProduct(string orderId, string productId)
        {
            var existedCategoryEntity = await _unitOfWork.productOrderDetailRepository.GetByOrderID(orderId, productId);

            if (existedCategoryEntity == null)
            {
                return NotFound(new { Message = $"Order with ID {orderId} not found." });
            }

            await _unitOfWork.productOrderDetailRepository.DeleteById(orderId, productId);
            _unitOfWork.Save();

            return Ok(new { Message = "Order deleted successfully." });
        }
        [HttpPut("update-quantity/{orderId}&{productId}")]
        public async Task<IActionResult> UpdateProductOrderDetailQuantity(string orderId, string productId, [FromBody] RequestCreateProductOrderDetailQuantity newQuantity)
        {
            try
            {
                // Kiểm tra nếu dữ liệu mới về Quantity là null
                if (newQuantity.Quantity == null)
                {
                    return BadRequest("New quantity is required.");
                }

                await _unitOfWork.productOrderDetailRepository.UpdateQuantityByOrderIdAsync(orderId, productId, newQuantity.Quantity);
                _unitOfWork.Save(); // Lưu thay đổi
                return Ok("Product order detail quantity updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> CreateProductOrderDetail(RequestCreateProductOrderDetail request)
        {
           
            await _unitOfWork.productOrderDetailRepository.AddProductOrderDetailAsync(
               request.OrderId,
               request.ProductId,
               request.Quantity ?? 0,
               request.Price ?? 0,
               request.Discount ?? 0);
            _unitOfWork.Save(); 
            return Ok("Product order detail added successfully.");
           



        }






    }
}
