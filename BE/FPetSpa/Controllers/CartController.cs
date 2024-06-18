using FPetSpa.Repository.Data;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Services;
using FPetSpa.Repository.Repository;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
       
        private readonly UnitOfWork _unitOfWork;

        public CartController(UnitOfWork unitOfWork)
        {
           
            _unitOfWork = unitOfWork;
        }


        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetAll()
        {
            var carts = await _unitOfWork.Carts.GetAllAsync();
            return Ok(carts);
        }

        [HttpGet("GetById")]
        public async Task<ActionResult<Cart>> GetById(string id)
        {
            var cart = await _unitOfWork.Carts.GetByIdAsync(id);
            if (cart == null)
            {
                return NotFound();
            }
            return Ok(cart);
        }
        [HttpPost("AddtoCart")]
        public async Task<ActionResult> Create(AddToCartModel request)
        {
            await _unitOfWork.Carts.AddAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = request.UserId }, request);
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteCart(string id)
        {
            var cart = await _unitOfWork.Carts.GetByIdAsync(id);
            if (cart == null)
            {
                return NotFound("Cart not found");
            }

            await _unitOfWork.Carts.DeleteCartAsync(cart.CartId);
            await _unitOfWork.SaveChangesAsync();

            return Ok("Cart deleted successfully");
        }
    }
}
