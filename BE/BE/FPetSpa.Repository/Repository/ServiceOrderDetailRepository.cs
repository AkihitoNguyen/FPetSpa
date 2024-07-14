using FPetSpa.Repository.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace FPetSpa.Repository.Repository
{
    public class ServiceOrderDetailRepository<T> where T : class
    {
        private readonly FpetSpaContext _context;

        public ServiceOrderDetailRepository(FpetSpaContext context)
        {
            _context = context;
        }

        public async Task<ServiceOrderDetail> GetByOrderID(string orderId, string serviceId)
        {
            return await _context.ServiceOrderDetails.FirstOrDefaultAsync(p => p.OrderId == orderId && p.ServiceId == serviceId);
        }

        public async Task<List<ServiceOrderDetail>> GetAllAsync()
        {
            return await _context.ServiceOrderDetails.ToListAsync();
        }

        public async Task DeleteById(string orderId, string serviceId)
        {
            try
            {
                var sql = @"
         DELETE FROM ServiceOrderDetails 
         WHERE OrderId = @OrderId AND ServiceId = @ServiceId";

                await _context.Database.ExecuteSqlRawAsync(
                    sql,
                    new SqlParameter("@OrderId", orderId),
                    new SqlParameter("@ServiceId", serviceId));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while deleting the product order detail: {ex.Message}");
                throw; // Re-throw để xử lý ở nơi gọi nếu cần
            }
        }


        public async Task UpdatePetById(string orderId, string serviceId, string newPetId)
        {
            try
            {
                var sql = @"
                UPDATE ServiceOrderDetails
                SET PetId = @NewPetId
                WHERE OrderId = @OrderId AND ServiceId = @ServiceId";

                await _context.Database.ExecuteSqlRawAsync(sql,
                new SqlParameter("@NewPetId", newPetId),
                new SqlParameter("@OrderId", orderId),
                new SqlParameter("@ServiceId", serviceId));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the service order detail: {ex.Message}");
                throw; // Re-throw để xử lý ở nơi gọi nếu cần
            }
        }

        public async Task AddServiceOrderDetailAsync(string serviceId, string orderId, double? discount, decimal? petWeight, decimal? price, string petId)
        {
            try
            {
                var sql = @"
            INSERT INTO ServiceOrderDetails (ServiceId, OrderId, Discount, PetWeight, Price, PetId)
            VALUES (@ServiceId, @OrderId, @Discount, @PetWeight, @Price, @PetId)";

                await _context.Database.ExecuteSqlRawAsync(sql,
                    new SqlParameter("@ServiceId", serviceId),
                    new SqlParameter("@OrderId", orderId),
                    new SqlParameter("@Discount", discount),
                    new SqlParameter("@PetWeight", petWeight),
                    new SqlParameter("@Price", price),
                    new SqlParameter("@PetId", petId));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while adding the product order detail: {ex.Message}");
                throw;
            }
        }

    }
}
