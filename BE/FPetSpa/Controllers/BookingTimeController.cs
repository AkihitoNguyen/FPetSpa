using FPetSpa.Repository;
using FPetSpa.Repository.Data;
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
            var result = _unitOfWork.BookingTime.GetAll().Result.OrderBy(x => x.Date).ThenBy(x => x.Time);
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
        public async Task<IActionResult> createBookingTime(TimeOnly Time, DateOnly Date, int MaxSlot)
        {
            if(MaxSlot < 0) return BadRequest("Invalid Slot");
            {
                BookingTime bookingTime = new BookingTime
                {
                    Date = Date,
                    MaxSlots = MaxSlot,
                    Time = Time
                };
                _unitOfWork.BookingTime.Insert(bookingTime);
                await _unitOfWork.SaveChangesAsync();
                return Ok($"Create Time {bookingTime} sucessfully");
            }
        }

        [HttpPut("UpdateBookingTime")]
        public async Task<IActionResult> updateBookingTime(TimeOnly TimeOld, TimeOnly TimeNew)
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
        public async Task<IActionResult> DeleteBookingTime(TimeOnly Time, DateOnly Date)
        {
            var check = _unitOfWork.BookingTime.GetAll().Result.FirstOrDefault(x => x.Time.Equals(Time) && x.Date == Date);
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
