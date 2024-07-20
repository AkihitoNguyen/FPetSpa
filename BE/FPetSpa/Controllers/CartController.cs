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
            if (await _unitOfWork._IaccountRepository.GetCustomerById(request.UserId) == null)
            {
                return BadRequest(new { message = "User is not available!!" });
            }
            if (_unitOfWork.ProductRepository.GetById(request.ProductId) == null)
            {
                return BadRequest(new { message = "Product is not available" });
            }
            if (request.Quantity <= 0)

            {
                return BadRequest(new { message = "Invalid quantity" });
            }

            var checkQuantity = _unitOfWork.ProductRepository.GetById(request.ProductId).ProductQuantity;
            if (checkQuantity == 0)
            {
                return BadRequest(new { message = "Out of stock" });

            }         
                var cartId = await _unitOfWork.Carts.AddAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = request.UserId }, cartId);
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
