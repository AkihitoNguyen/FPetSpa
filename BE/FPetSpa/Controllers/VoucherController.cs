using FPetSpa.Repository.Data;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FPetSpa.Models.VoucherModel;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public VoucherController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult> GetVouchers()
        {
            var vouchers = await _unitOfWork.VoucherRepository.GetAll();
            return Ok(vouchers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetVoucher(string id)
        {
            var voucher = await _unitOfWork.VoucherRepository.GetByIdAsync(id);

            if (voucher == null)
            {
                return NotFound();
            }

            return Ok(voucher);
        }

        [HttpPost]
        public async Task<ActionResult> CreateVoucher(RequestVoucher requestVoucher)
        {
            var voucher = new Voucher
            {
                VoucherId = requestVoucher.VoucherId,
                Description = requestVoucher.Description,
                StartDate = requestVoucher.StartDate,
                EndDate = requestVoucher.EndDate,
            };
            _unitOfWork.VoucherRepository.Insert(voucher);
            _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateVoucher(string id, RequestVoucher requestVoucher)
        {
            if (id != requestVoucher.VoucherId)
            {

                return BadRequest();
            }
            var checkExits = await _unitOfWork.VoucherRepository.GetByIdAsync(id);
            if (checkExits != null)
            {
                checkExits.VoucherId = requestVoucher.VoucherId;
                checkExits.Description = requestVoucher.Description;
                checkExits.StartDate = requestVoucher.StartDate;
                checkExits.EndDate = requestVoucher.EndDate;

            }
            _unitOfWork.VoucherRepository.Update(checkExits);
            _unitOfWork.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteVoucher")]
        public async Task<IActionResult> DeleteVoucher(string id)
        {
            var voucher = await _unitOfWork.VoucherRepository.GetByIdAsync(id);
            if (voucher == null)
            {
                return NotFound();
            }

            _unitOfWork.VoucherRepository.Delete(voucher);
            await _unitOfWork.SaveChangesAsync();

            return Ok();
        }
    }
}
