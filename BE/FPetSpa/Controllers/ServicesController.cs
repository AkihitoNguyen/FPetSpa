using FPetSpa.Repository.Data;
using FPetSpa.Model.ServiceModel;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static FPetSpa.Model.ServiceModel.RequestSearchServiceModel;
using System.Linq.Expressions;
using FPetSpa.Repository.Services;
using FPetSpa.Models.ServiceModel;
using FPetSpa.Repository.Data;
namespace FPetSpa.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IIdService _idService;

        public ServicesController(UnitOfWork unitOfWork, IIdService service)
        {
            _unitOfWork = unitOfWork;
            _idService = service;
        }

        [HttpGet]
        public IActionResult SearchService([FromQuery] RequestSearchServiceModel requestSearchServiceModel)
        {
            var sortBy = requestSearchServiceModel.SortContent != null ? requestSearchServiceModel.SortContent?.sortServiceBy.ToString() : null;
            var sortType = requestSearchServiceModel.SortContent != null ? requestSearchServiceModel.SortContent?.sortServiceType.ToString() : null;
            Expression<Func<Service, bool>> filter = x =>
                (string.IsNullOrEmpty(requestSearchServiceModel.ServiceName) || x.ServiceName.Contains(requestSearchServiceModel.ServiceName)) &&
                (x.CategoryId == requestSearchServiceModel.CategoryId || requestSearchServiceModel.CategoryId == null) &&
                x.UnitPrice >= requestSearchServiceModel.FromUnitPrice &&
                (x.UnitPrice <= requestSearchServiceModel.ToUnitPrice || requestSearchServiceModel.ToUnitPrice == null);
            Func<IQueryable<Service>, IOrderedQueryable<Service>> orderBy = null;

            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortType == SortServiceTypeEnum.Ascending.ToString())
                {
                    orderBy = query => query.OrderBy(p => EF.Property<object>(p, sortBy));
                }
                else if (sortType == SortServiceTypeEnum.Descending.ToString())
                {
                    orderBy = query => query.OrderByDescending(p => EF.Property<object>(p, sortBy));
                }
            }
            var responseCategorie = _unitOfWork.ServiceRepository.Get(
                null,
                orderBy,
                includeProperties: "",
                pageIndex: requestSearchServiceModel.pageIndex,
                pageSize: requestSearchServiceModel.pageSize
            );
            return Ok(responseCategorie);
        }

        [HttpGet("{id}")]
        public IActionResult GetServiceById(String id)
        {
            var responseCategories = _unitOfWork.ServiceRepository.GetById(id);
            return Ok(responseCategories);
        }

        [HttpGet("findByWeight")]
        public IActionResult GetServicesByWeight([FromQuery] RequestWeightFilterServiceModel request)
        {
            if (request.Weight <= 0)
            {
                return BadRequest("Weight must be a positive number.");
            }

            Expression<Func<Service, bool>> filter = x =>
                x.MinWeight <= request.Weight && x.MaxWeight >= request.Weight;

            var services = _unitOfWork.ServiceRepository.Get(filter);

            return Ok(services);
        }
        [HttpPost]
        public async Task<IActionResult> CreateService(RequestCreateServiceModel requestCreateServiceModel)
        {
            var newServiceId = await _idService.GenerateNewServiceIdAsync();
            var service = new Service
            {
                ServiceId = newServiceId,
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
        public IActionResult UpdateService(String id, RequestCreateServiceModel requestCreateServiceModel)
        {
            var existedServiceEntity = _unitOfWork.ServiceRepository.GetById(id);
            if (existedServiceEntity != null)
            {
                existedServiceEntity.PictureName = requestCreateServiceModel.PictureName;
                existedServiceEntity.ServiceName = requestCreateServiceModel.ServiceName;
                existedServiceEntity.MinWeight = requestCreateServiceModel.MinWeight;
                existedServiceEntity.MaxWeight = requestCreateServiceModel.MaxWeight;
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
