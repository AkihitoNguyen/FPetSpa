using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public OrderController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> getAllOrder()
        {
             var result =  _unitOfWork.OrderGenericRepo.GetAll();
            if(result != null) return Ok(result);
            return BadRequest();
        }

 
    }
}
