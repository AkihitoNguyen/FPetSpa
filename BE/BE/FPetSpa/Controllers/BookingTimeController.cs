using FPetSpa.Repository;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingTimeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BookingTimeController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllBookingTime")]
        public async Task<IActionResult> BookingTime()
        {
            var result =  _unitOfWork.BookingTime.GetAll().Result.OrderBy(x => x.Time);
            if(result == null) return NotFound();
            return Ok(result);  
        }


        [HttpGet("GetByTime")]
        public async Task<IActionResult> getTime(string Time)
        {
            var result =  _unitOfWork.BookingTime.GetAll().Result.FirstOrDefault(x => x.Time.Equals(Time));
            if(result == null) return NotFound();   
            return Ok(result);
        }

        [HttpPost("CreateBookingTime")]
        public async Task<IActionResult> createBookingTime(string Time)
        {
            var result = TimeOnly.TryParse(Time, out _);
            if (result)
            {
                _unitOfWork.BookingTime.Insert(new Repository.Data.BookingTime { Time = Time });
                await _unitOfWork.SaveChangesAsync();
                return Ok($"Create Time {Time} sucessfully");
            }
            return BadRequest();
        }

        [HttpPut("UpdateBookingTime")]
        public async Task<IActionResult> updateBookingTime(string TimeOld, string TimeNew)
        {
            var check = _unitOfWork.BookingTime.GetAll().Result.FirstOrDefault(x => x.Time.Equals(TimeOld));
            if (check == null) return BadRequest();
            else
            {
                check.Time = TimeNew;
                _unitOfWork.BookingTime.Update(check);
                await _unitOfWork.SaveChangesAsync();
                return Ok();
            }
        }

        [HttpDelete("DeleteBookingTime")]
        public async Task<IActionResult> DeleteBookingTime(string Time)
        {
            var check = _unitOfWork.BookingTime.GetAll().Result.FirstOrDefault(x => x.Time.Equals(Time));
            if (check == null) return BadRequest();
            else
            {
                check.Time = Time;
                _unitOfWork.BookingTime.Delete(check);
                await _unitOfWork.SaveChangesAsync();
                return Ok();
            }
        }
    }
}
