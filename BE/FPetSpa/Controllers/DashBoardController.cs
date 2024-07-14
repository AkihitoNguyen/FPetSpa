using FPetSpa.Models.DashBoradController;
using FPetSpa.Repository;
using FPetSpa.Repository.Model.OrderModel;
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
    }
}
