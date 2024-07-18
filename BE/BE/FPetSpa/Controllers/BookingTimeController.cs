using FPetSpa.Repository;
<<<<<<< HEAD:BE/BE/FPetSpa/Controllers/BookingTimeController.cs
=======
using FPetSpa.Repository.Data;
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa/Controllers/BookingTimeController.cs
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
<<<<<<< HEAD:BE/BE/FPetSpa/Controllers/BookingTimeController.cs
            var result =  _unitOfWork.BookingTime.GetAll().Result.OrderBy(x => x.Time);
=======
            var result = _unitOfWork.BookingTime.GetAll().Result.OrderBy(x => x.Date).ThenBy(x => x.Time);
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa/Controllers/BookingTimeController.cs
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
<<<<<<< HEAD:BE/BE/FPetSpa/Controllers/BookingTimeController.cs
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
=======
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
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa/Controllers/BookingTimeController.cs
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
<<<<<<< HEAD:BE/BE/FPetSpa/Controllers/BookingTimeController.cs
        public async Task<IActionResult> DeleteBookingTime(string Time)
        {
            var check = _unitOfWork.BookingTime.GetAll().Result.FirstOrDefault(x => x.Time.Equals(Time));
=======
        public async Task<IActionResult> DeleteBookingTime(TimeOnly Time, DateOnly Date)
        {
            var check = _unitOfWork.BookingTime.GetAll().Result.FirstOrDefault(x => x.Time.Equals(Time) && x.Date == Date);
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa/Controllers/BookingTimeController.cs
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
