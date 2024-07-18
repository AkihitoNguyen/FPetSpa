using FPetSpa.Repository;
using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly TransactionService _transactionService;

        public TransactionController(IUnitOfWork unitOfWork, TransactionService transactionService)
        {
            _unitOfWork = unitOfWork;
            _transactionService = transactionService;
        }

        [HttpGet("getAllTransaction")]   
        public async Task<IActionResult> getAllTransaction()
        {
            var result = await  _unitOfWork.TransactionRepository.GetAllAsync();
            if(result != null)
            return Ok(result);
            return BadRequest("Something went wrong!!!");
        }

        [HttpGet("getTransactionById")]
        public async Task<IActionResult> getTransactionById(string transactionId)
        {
            var result = _unitOfWork.TransactionRepository.GetById(transactionId);
            if(result != null) return Ok(result);
            return BadRequest();
        }

        [HttpGet("UpdateTransactionByIdUserAndStatusString")]
        public async Task<IActionResult> UpdateTransactionByIdUserAndStatusString(string transactionId, string statusString)
        {
            var result = await _transactionService.UpdateTransaction(transactionId, statusString);
            if (result != null) return Ok(result);
            return BadRequest();
        }

    }
}
