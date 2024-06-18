using FPetSpa.Repository.Data;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FPetSpa.Repository.Model;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartDetailController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public CartDetailController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var cartDetails = await _unitOfWork.CartDetails.GetAllAsync();
            return Ok(cartDetails);
        }

        [HttpGet("Getbyid")]
        public async Task<ActionResult<CartDetail>> GetById(string cartId, string productId)
        {
            var cartDetail = await _unitOfWork.CartDetails.GetByIdAsync(cartId, productId);
            if (cartDetail == null)
            {
                return NotFound();
            }
            return Ok(cartDetail);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(string cartId, string productId, RequestQuantityCartDetail request)
        {
            if (request.Quantity == null)
            {
                return BadRequest("New quantity is required.");
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

