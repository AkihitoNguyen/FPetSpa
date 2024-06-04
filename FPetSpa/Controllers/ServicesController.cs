using FPetSpa.Repository.Data;
using FPetSpa.Models.ServiceModel;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FPetSpa.Repository.Helper;

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
        [Authorize(Roles = Role.Customer)]
        public async Task<IActionResult> GetAll()
        {
            var result = await _unitOfWork.ServiceRepository.GetAll();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Role.Staff)]
        public IActionResult GetServiceById(String id)
        {
            var responseCategories = _unitOfWork.ServiceRepository.GetById(id);
            return Ok(responseCategories);
        }

        [HttpPost]
        [Authorize]

        public IActionResult CreateService(RequestCreateServiceModel requestCreateServiceModel)
        {
            var service = new Service
            {
                ServiceId = requestCreateServiceModel.ServiceId,
                PictureName = requestCreateServiceModel.PictureName,
                ServiceName = requestCreateServiceModel.ServiceName,
                MinWeight = requestCreateServiceModel.MinWeight,
                MaxWeight = requestCreateServiceModel.MaxWeight,
                Description = requestCreateServiceModel.Description,
                Price = requestCreateServiceModel.Price,
                StartDate = requestCreateServiceModel.StartDate,
                EndDate = requestCreateServiceModel.EndDate,
                Status = requestCreateServiceModel.Status,
            };
            _unitOfWork.ServiceRepository.Insert(service);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpPut("{id}")]
        [Authorize]

        public IActionResult UpdateService(String id, RequestCreateServiceModel requestCreateServiceModel)
        {
            var existedServiceEntity = _unitOfWork.ServiceRepository.GetById(id);
            if (existedServiceEntity != null)
            {
                existedServiceEntity.ServiceId = requestCreateServiceModel.ServiceId;
                existedServiceEntity.PictureName = requestCreateServiceModel.PictureName;
                existedServiceEntity.ServiceName = requestCreateServiceModel.ServiceName;
                existedServiceEntity.MinWeight = requestCreateServiceModel.MinWeight;
                existedServiceEntity.MaxWeight  = requestCreateServiceModel.MaxWeight;  
                existedServiceEntity.Description = requestCreateServiceModel.Description;
                existedServiceEntity.Price = requestCreateServiceModel.Price;
                existedServiceEntity.StartDate = requestCreateServiceModel.StartDate;
                existedServiceEntity.EndDate = requestCreateServiceModel.EndDate;
                existedServiceEntity.Status = requestCreateServiceModel.Status;

            }
            _unitOfWork.ServiceRepository.Update(existedServiceEntity);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteService(String id)
        {
            var existedCategoryEntity = _unitOfWork.ServiceRepository.GetById(id);
            _unitOfWork.ServiceRepository.Delete(existedCategoryEntity);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
