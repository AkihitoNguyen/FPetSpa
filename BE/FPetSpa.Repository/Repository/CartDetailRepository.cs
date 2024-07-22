using FPetSpa.Repository.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<CartDetail>> GetByIdAsync(string userId)
        {
            var list = _context.Carts.Include(c => c.CartDetails).FirstOrDefault(c => c.UserId == userId);

            if (list != null) return list.CartDetails.ToList();
            else return null!;
        }
        public async Task AddAsync(CartDetail cartDetail)
        {
            await _context.CartDetails.AddAsync(cartDetail);
        }
        public async Task DeleteAsync(string cartId, string productId)
        {
            var cartDetail = await _context.CartDetails.FirstOrDefaultAsync(cd => cd.CartId == cartId && cd.ProductId == productId);
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
