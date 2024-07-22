using FPetSpa.Repository.Data;
using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly IStaffServices _staffServices;

        public StaffController(IStaffServices staffServices)
        {
            _staffServices = staffServices;
        }

        // GET: api/staff
        [HttpGet]
        public async Task<ActionResult<List<StaffStatus>>> GetAllStaff()
        {
            var staffList = await _staffServices.GetAllStaff();
            return Ok(staffList);
        }

        // GET: api/staff/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffStatus>> GetStaffById(string id)
        {
            var staff = await _staffServices.GetStaffById(id);
            if (staff == null)
            {
                return NotFound();
            }
            return Ok(staff);
        }

        // POST: api/staff
        [HttpPost]
        public async Task<ActionResult> CreateStaff([FromBody] StaffStatus staff)
        {
            if (staff == null)
            {
                return BadRequest("Staff cannot be null.");
            }

            await _staffServices.CreateStaff(staff);
            return CreatedAtAction(nameof(GetStaffById), new { id = staff.StaffId }, staff);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateStaffStatus(string id, [FromBody] int status)
        {
            try
            {
                await _staffServices.UpdateStaffStatus(id, status);
                return Ok(); // Trả về 204 No Content
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message); // Trả về 400 Bad Request
            }
        }
        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<StaffStatus>>> GetStaffByStatus(int status)
        {
            var staff = await _staffServices.GetFirstStaffByStatus(status);
            if (staff == null)
            {
                return NotFound("No staff found with the specified status.");
            }
            return Ok(staff);
        }
        // DELETE: api/staff/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteStaff(string id)
        {
            await _staffServices.DeleteStaff(id);
            return NoContent();
        }
        [HttpPut("{OrderId}/update-status")]
        public async Task<ActionResult> UpdateStaffStatusBasedOnOrder(string OrderId)
        {
            try
            {
                
                await _staffServices.UpdateStaffStatusBasedOnOrder(OrderId);
                return Ok(new { Message = "Trạng thái nhân viên đã được cập nhật" }); 
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { Message = ex.Message }); 
            }
        }
    }
}
