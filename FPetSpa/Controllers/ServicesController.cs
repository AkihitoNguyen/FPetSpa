using FPetSpa.Repository;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {       
        private readonly UnitOfWork _unitOfWork;

            
        public ServicesController(UnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _unitOfWork.ServiceRepository.GetAll();
            return Ok(result);
        }
    }
}
