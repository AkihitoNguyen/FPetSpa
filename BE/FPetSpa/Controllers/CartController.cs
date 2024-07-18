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
       
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CartController> _logger;

        public CartController(IUnitOfWork unitOfWork,ILogger<CartController> logger)
        {
           
            _unitOfWork = unitOfWork;
            _logger = logger;


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
            try
            {
                var cartId = await _unitOfWork.Carts.AddAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = request.UserId }, cartId);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding to the cart.");
                return StatusCode(500, "An error occurred while processing your request.");
            }

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
