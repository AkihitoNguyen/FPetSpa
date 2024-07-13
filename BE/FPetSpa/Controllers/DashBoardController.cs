using FPetSpa.Models.DashBoradController;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashBoardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
     
        [HttpGet("order-count")]
        public async Task<IActionResult> GetOrderCount()
        {
            var orderCount = await _unitOfWork.OrderRepository.GetOrderCount();
            return Ok(orderCount);
        }
        [HttpGet("compare-orders")]
        public async Task<IActionResult> CompareOrders([FromQuery] int year1, [FromQuery] int month1, [FromQuery] int year2, [FromQuery] int month2)
        {
            var result = await _unitOfWork.OrderRepository.CompareOrdersForTwoMonthsAsync(year1, month1, year2, month2);
            return Ok(result);
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

        [HttpGet("search-total-revenue")]
        public async Task<IActionResult> SearchTotalRevenue([FromQuery] RequestSearchTotalModel request)
        {
            try
            {
                var totalRevenue = await _unitOfWork.OrderRepository.GetTotalRevenueAsync(request.FromDate, request.ToDate);
                return Ok(totalRevenue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpGet("count-by-date")]
        public async Task<IActionResult> GetOrderCountByDate([FromQuery] DateTime date)
        {
            var count = await _unitOfWork.OrderRepository.GetOrderCountByDate(date);
            return Ok(count);
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
    }
}
