using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            return await _context.Carts.Include(c => c.CartDetails).FirstOrDefaultAsync(c => c.CartId == id);
        }

        public async Task AddAsync(AddToCartModel request)
        {
            var cart = new Cart
            {
                CartId = Guid.NewGuid().ToString(),
                UserId = request.UserId,
                CreatedDate = DateTime.UtcNow
            };

            var product = await _context.Products.FindAsync(request.ProductId);
            var productPrice = product?.Price ?? 0m; 
            var cartDetail = new CartDetail
            {
                CartId = cart.CartId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Price = productPrice * request.Quantity  // Update this based on product price
            };

            await _context.Carts.AddAsync(cart);
            await _context.CartDetails.AddAsync(cartDetail);
 
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
