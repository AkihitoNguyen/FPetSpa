using FPetSpa.Repository.Data;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Model.CartDetailModel;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartDetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ImageController image;

        public CartDetailController(IUnitOfWork unitOfWork, ImageController imageController)
        {
            _unitOfWork = unitOfWork;
            this.image = imageController;
        }


        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var cartDetails = await _unitOfWork.CartDetails.GetAllAsync();
            return Ok(cartDetails);
        }

        [HttpGet("Getbyid")]
        public async Task<ActionResult> GetById(string userId)
        {
            var cartDetail = await _unitOfWork.CartDetails.GetByIdAsync(userId);
            if (cartDetail != null)
            {
                var result = cartDetail.Select(async p => new CartDetailResponse
                {
                    CartId = p.CartId,
                    ProductId = p.ProductId,
                    ProductName = _unitOfWork.ProductRepository.GetById(p.ProductId!).ProductName!,
                    Price = p.Price,
                    PictureName = await image.GetLinkByName("productfpetspa", _unitOfWork.ProductRepository.GetById(p.ProductId!).PictureName!),
                    Quantity = p.Quantity
                });
                return Ok(await Task.WhenAll(result));
            }else return Ok("Empty Cart");
        }
        

        [HttpPut("Update")]
        public async Task<IActionResult> Update(string cartId, string productId, RequestQuantityCartDetail request)
        {
            if (request.Quantity == null)
            {
                return BadRequest("New quantity is required.");
            }
            if (request.Quantity <= 0)

            {
                return BadRequest(new { message = "Invalid quantity" });
            }
            
            var checkQuantity = _unitOfWork.ProductRepository.GetById(productId).ProductQuantity;
            if (checkQuantity == 0 || checkQuantity - request.Quantity < 0)
            {
                
                return BadRequest(new { message = "Out of stock" });
            }

            try
            {
                await _unitOfWork.CartDetails.UpdateAsync(cartId, productId, request.Quantity);
                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(string cartId, string productId)
        {
            try
            {
                await _unitOfWork.CartDetails.DeleteAsync(cartId, productId);
                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}

