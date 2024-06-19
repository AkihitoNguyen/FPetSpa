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
        private readonly UnitOfWork _unitOfWork;

        public DashBoardController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
     
        [HttpGet("order-count")]
        public async Task<IActionResult> GetOrderCount()
        {
            var orderCount = await _unitOfWork.OrderRepository.GetOrderCount();
            return Ok(orderCount);
        }
        [HttpGet("compare-revenue")]
        public async Task<IActionResult> CompareRevenue([FromQuery] DateTime month1, [FromQuery] DateTime month2)
        {
            try
            {
                var (revenueMonth1, revenueMonth2) = await _unitOfWork.OrderRepository.GetRevenueForTwoMonthsAsync(month1, month2);
                return Ok(new { Month1 = revenueMonth1, Month2 = revenueMonth2 });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
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
    }
}
