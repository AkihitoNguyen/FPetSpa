using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FPetSpa.Repository.Repository
{
    public class CartRepository<T> where T : class
    {
        protected readonly FpetSpaContext _context;
      
      

        public CartRepository(FpetSpaContext context)
        {
            _context = context;
        }



        
        public async Task<IEnumerable<Cart>> GetAllAsync()
        {
            return await _context.Carts.ToListAsync();
        }

        public async Task<Cart> GetByIdAsync(string id)
        {
            return await _context.Carts.FindAsync(id);
        }
        
        public async Task<String> AddAsync(AddToCartModel request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            // Check if the user already has a cart
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            if (cart == null)
            {
                // Create a new cart if the user doesn't have one
                cart = new Cart
                {
                    CartId = Guid.NewGuid().ToString(),
                    UserId = request.UserId,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.Carts.AddAsync(cart);
            }

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                throw new ArgumentException("Product not found");
            }

            // Check if the cart already contains the product
            var cartDetail = await _context.CartDetails
                .FirstOrDefaultAsync(cd => cd.CartId == cart.CartId && cd.ProductId == request.ProductId);

            if (cartDetail == null)
            {
                // Add new product to the cart if it doesn't exist
                cartDetail = new CartDetail
                {
                    CartId = cart.CartId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    Price = product.Price * request.Quantity
                };

                await _context.CartDetails.AddAsync(cartDetail);
            }
            else
            {
                // Update quantity and price if the product already exists in the cart
                cartDetail.Quantity += request.Quantity;
                cartDetail.Price += product.Price * request.Quantity;

                _context.CartDetails.Update(cartDetail);
            }
            await _context.SaveChangesAsync();
            return cart.CartId;
        }
        public async Task DeleteCartAsync(string cartId)
        {
            var cart = await _context.Carts.Include(c => c.CartDetails).FirstOrDefaultAsync(c => c.CartId == cartId);
            if (cart != null)
            {
                _context.CartDetails.RemoveRange(cart.CartDetails);
                _context.Carts.Remove(cart);
                await _context.SaveChangesAsync();
            }
        }

    }
}
