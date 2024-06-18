using FPetSpa.Repository.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Amazon.S3.Util.S3EventNotification;

namespace FPetSpa.Repository.Repository
{
    public class CartDetailRepository<T> where T : class
    {
        protected readonly FpetSpaContext _context;



        public CartDetailRepository(FpetSpaContext context)
        {
            _context = context;
        }



        public async Task<IEnumerable<CartDetail>> GetAllAsync()
        {
            // Kiểm tra và xử lý giá trị null
            return await _context.CartDetails
                .Select(cd => new CartDetail
                {
                    CartId = cd.CartId,
                    ProductId = cd.ProductId,
                    Quantity = cd.Quantity,
                    Price = cd.Price,
                    Cart = cd.Cart,
                    Product = cd.Product
                }).ToListAsync();
        }

        public async Task<CartDetail> GetByIdAsync(string cartId, string productId)
        {
            return await _context.CartDetails
                .FirstOrDefaultAsync(cd => cd.CartId == cartId && cd.ProductId == productId);
        }
        public async Task AddAsync(CartDetail cartDetail)
        {
            await _context.CartDetails.AddAsync(cartDetail);
        }
        public async Task DeleteAsync(string cartId, string productId)
        {
            var cartDetail = await GetByIdAsync(cartId, productId);
            if (cartDetail != null)
            {
                _context.CartDetails.Remove(cartDetail);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("CartDetail not found");
            }
        }

        public async Task UpdateAsync(string cartId, string productId, int Quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }
            decimal newPrice = (decimal)(product.Price * Quantity);

            try
            {
                var sql = "UPDATE CartDetails SET Quantity = @Quantity, Price = @Price WHERE CartId = @CartId AND ProductId = @ProductId";
                var parameters = new[] {

            new SqlParameter("@Quantity", Quantity),
             new SqlParameter("@Price", newPrice),
            new SqlParameter("@CartId", cartId),
            new SqlParameter("@ProductId", productId),

                };

                _context.Database.ExecuteSqlRaw(sql, parameters);


            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the product cartdetail's quantity: {ex.Message}");
                throw;
            }
        }


    }
}
