    using FPetSpa.Repository.Data;
    using FPetSpa.Repository.Repository;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

public class OrderRepository <T> where T : class
    {
        private readonly FpetSpaContext _context;

        public OrderRepository(FpetSpaContext context) 
        {
            _context = context;
        }
    public async Task<int> GetOrderCount()
    {
        return await _context.Orders.CountAsync();
    }
    public async Task<(decimal, decimal)> GetRevenueForTwoMonthsAsync(DateTime month1, DateTime month2)
    {
        var revenueMonth1 = await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Month == month1.Month && o.RequiredDate.Value.Year == month1.Year)
            .SumAsync(o => o.Total ?? 0);

        var revenueMonth2 = await _context.Orders
            .Where(o => o.RequiredDate.HasValue && o.RequiredDate.Value.Month == month2.Month && o.RequiredDate.Value.Year == month2.Year)
            .SumAsync(o => o.Total ?? 0);

        return (revenueMonth1, revenueMonth2);
    }

    public async Task<decimal> GetTotalRevenueAsync(DateTime? fromDate, DateTime? toDate)
    {
        var query = _context.Orders.AsQueryable();

        if (fromDate.HasValue)
        {
            query = query.Where(o => o.RequiredDate >= DateOnly.FromDateTime(fromDate.Value));
        }

        if (toDate.HasValue)
        {
            query = query.Where(o => o.RequiredDate <= DateOnly.FromDateTime(toDate.Value));
        }

        return await query.SumAsync(o => o.Total ?? 0);
    }
}
