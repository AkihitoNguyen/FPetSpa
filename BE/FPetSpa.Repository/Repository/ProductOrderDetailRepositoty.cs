using FPetSpa.Repository.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public class ProductOrderDetailRepositoty<T> where T : class
    {
        private FpetSpaContext _context;
        private DbSet<T> dbSet;

        public ProductOrderDetailRepositoty(FpetSpaContext context)
        {
            this._context = context;
        }
        public async Task<List<ProductOrderDetail>> GetAllAsync()
        {
            return await _context.ProductOrderDetails.ToListAsync();
        }

        public async Task<ProductOrderDetail> GetByOrderID(string orderId, string productId)
        {
            return await _context.ProductOrderDetails.FirstOrDefaultAsync(p => p.OrderId == orderId && p.ProductId == productId);
        }


        public async Task DeleteById(string orderId, string productId)
        {
            try
            {
                var sql = @"
            DELETE FROM ProductOrderDetails 
            WHERE OrderId = @OrderId AND ProductId = @ProductId";

                await _context.Database.ExecuteSqlRawAsync(
                    sql,
                    new SqlParameter("@OrderId", orderId),
                    new SqlParameter("@ProductId", productId));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while deleting the product order detail: {ex.Message}");
                throw; // Re-throw để xử lý ở nơi gọi nếu cần
            }
        }



        public async Task UpdateQuantityByOrderIdAsync(string orderId, string productId, int newQuantity)
        {
            try
            {
                var sql = @"
            UPDATE ProductOrderDetails
            SET Quantity = @NewQuantity
            WHERE OrderId = @OrderId and ProductId = @ProductId";

                await _context.Database.ExecuteSqlRawAsync(sql,
                    new SqlParameter("@NewQuantity", newQuantity),
                    new SqlParameter("@OrderId", orderId),
                    new SqlParameter("@ProductId", productId));
            }   
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the product order detail quantity: {ex.Message}");
                throw; 
            }
        }
        public async Task AddProductOrderDetailAsync(string orderId, string productId, int quantity, decimal price, double discount)
        {
            try
            {
                var sql = @"
            INSERT INTO ProductOrderDetails (OrderId, ProductId, Quantity, Price, Discount)
            VALUES (@OrderId, @ProductId, @Quantity, @Price, @Discount)";

                await _context.Database.ExecuteSqlRawAsync(sql,
                    new SqlParameter("@OrderId", orderId),
                    new SqlParameter("@ProductId", productId),
                    new SqlParameter("@Quantity", quantity),
                    new SqlParameter("@Price", price),
                    new SqlParameter("@Discount", discount));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while adding the product order detail: {ex.Message}");
                throw; 
            }
        }

        public async Task<decimal> GetTotalRevenue()
        {
            return await _context.ProductOrderDetails.SumAsync(p => p.Quantity * p.Price);
        }

        public async Task<int> GetOrderCount()
        {
            return await _context.Orders.CountAsync();
        }


    }

}
    

   

