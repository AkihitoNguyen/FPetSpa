using FPetSpa.Models.DashBoradController;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model.OrderModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly FpetSpaContext _context;
        public DashBoardController(IUnitOfWork unitOfWork, FpetSpaContext fpetSpaContext)
        {
            _unitOfWork = unitOfWork;
            _context = fpetSpaContext;
        }

        [HttpGet("order-count")]
        public async Task<IActionResult> GetOrderCount()
        {
            var orderCount = await _unitOfWork.OrderRepository.GetOrderCount();
            return Ok(orderCount);
        }
   
        [HttpGet("total-revenue")]
        public async Task<IActionResult> GetTotalRevenue()
        {
            try
            {
                var totalRevenue = await _unitOfWork.OrderRepository.GetTotalRevenueAsync(null, null);
                return Ok(totalRevenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

    
        [HttpGet("date-range")]
        public async Task<ActionResult<List<OrderResponse>>> GetOrderStatsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var orderStats = await _unitOfWork.OrderRepository.GetOrderStatsByDateRange(startDate, endDate);

                if (orderStats == null)
                {
                    return NotFound();
                }

                return Ok(orderStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("count-by-month")]
        public async Task<IActionResult> GetOrderCountByMonth([FromQuery] int year, [FromQuery] int month)
        {
            var count = await _unitOfWork.OrderRepository.GetOrderCountByMonth(year, month);
            return Ok(count);
        }

        [HttpGet("count-by-year")]
        public async Task<IActionResult> GetOrderCountByYear([FromQuery] int year)
        {
            var count = await _unitOfWork.OrderRepository.GetOrderCountByYear(year);
            return Ok(count);
        }
        [HttpGet("GetOrderStatistics")]
        public async Task<ActionResult<IEnumerable<OrderStatistics>>> GetOrderStatistics()
        {
            try
            {
                var statistics = await _unitOfWork.OrderRepository.GetOrderStatisticsAsync();
                if (statistics == null || !statistics.Any())
                {
                    return NotFound(new { message = "No order statistics available" });
                }
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DashboardData>>> GetDashboardData()
        {
            var dashboardData = await (from order in _context.Orders
                                       join customer in _context.Users on order.CustomerId equals customer.Id
                                       join staff in _context.Staff on order.StaffId equals staff.StaffId into staffJoin
                                       from staff in staffJoin.DefaultIfEmpty()
                                       join transaction in _context.Transactions on order.TransactionId equals transaction.TransactionId
                                       join paymentMethod in _context.PaymentMethods on transaction.MethodId equals paymentMethod.MethodId into paymentMethodJoin
                                       from paymentMethod in paymentMethodJoin.DefaultIfEmpty()
                                       select new DashboardData
                                       {
                                           OrderId = order.OrderId,
                                           CustomerId = customer.Id,
                                           CustomerName = customer.FullName,
                                           Total = order.Total,
                                           TransactionDate = order.CreateTime,
                                           PaymentMethod = paymentMethod != null ? paymentMethod.MethodName : "Unassigned",
                                           StaffName = staff != null ? staff.StaffName : "Unassigned",
                                           Status = order.Status,
                                           DeliveryOption = order.DeliveryOption,
                                           TransactionStatus = transaction.Status 
                                       }).ToListAsync();

            return Ok(dashboardData);
        }

    }
}
