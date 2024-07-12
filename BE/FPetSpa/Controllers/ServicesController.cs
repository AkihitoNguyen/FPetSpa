using FPetSpa.Repository.Data;
using FPetSpa.Model.ServiceModel;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static FPetSpa.Model.ServiceModel.RequestSearchServiceModel;
using System.Linq.Expressions;
using FPetSpa.Repository.Services;
using FPetSpa.Models.ServiceModel;
using FPetSpa.Models.ProductModel;
namespace FPetSpa.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIdService _idService;
        private readonly ImageController _imageController;

        public ServicesController(IUnitOfWork unitOfWork, IIdService service, ImageController imageController)
        {
            _unitOfWork = unitOfWork;
            _idService = service;
            _imageController = imageController;
        }

        [HttpGet("Search")]
        public async Task<IActionResult> SearchServiceAsync([FromQuery] RequestSearchServiceModel requestSearchServiceModel)
        {
            var sortBy = requestSearchServiceModel.SortContent != null ? requestSearchServiceModel.SortContent?.sortServiceBy.ToString() : null;
            var sortType = requestSearchServiceModel.SortContent != null ? requestSearchServiceModel.SortContent?.sortServiceType.ToString() : null;
            Expression<Func<Service, bool>> filter = x =>
                (string.IsNullOrEmpty(requestSearchServiceModel.ServiceName) || x.ServiceName.Contains(requestSearchServiceModel.ServiceName)) &&
                (requestSearchServiceModel.FromUnitPrice == null || x.Price > requestSearchServiceModel.FromUnitPrice) &&
                (requestSearchServiceModel.ToUnitPrice == null || x.Price < requestSearchServiceModel.ToUnitPrice) &&
                (x.MinWeight < 1 && x.MaxWeight > 2);
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
                filter,
                orderBy,
                includeProperties: "",
                pageIndex: requestSearchServiceModel.pageIndex,
                pageSize: requestSearchServiceModel.pageSize
            );
            var result = responseCategorie.Select(async x => new ResponseSearchModel
            {
                ServicesId = x.ServiceId,
                ServiceName = x.ServiceName!,
                Description = x.Description!,
                PictureServices = await _imageController.GetLinkByName("fpetspaservices", x.PictureName!),
                Price = x.Price!.Value
            });
            return Ok(await Task.WhenAll(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(String id)
        {
            var responseCategories = _unitOfWork.ServiceRepository.GetById(id);
            if(responseCategories != null)
            {
                responseCategories.PictureName = await _imageController.GetLinkByName("fpetspaservices", responseCategories.PictureName!);
                return (Ok(responseCategories));    
            }
            return BadRequest();
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
        public async Task<IActionResult> CreateService(IFormFile File, string SerName, decimal Price)
        {
            var newServiceId = await _idService.GenerateNewServiceIdAsync();
            var checkImageUpload = await _imageController.UploadFileAsync(File, "fpetspaservices", null);
            if (checkImageUpload != null)
            {
                var service = new Service
                {
                    ServiceId = newServiceId,
                    PictureName = File.FileName,
                    ServiceName = SerName,
                    MinWeight = 0,
                    MaxWeight = 15,
                    Description = "",
                    Price = Price,
                    StartDate = null,
                    EndDate = null,
                    Status = 0,
                };
                _unitOfWork.ServiceRepository.Insert(service);
                _unitOfWork.Save();
                return Ok();
            }
            return BadRequest();
        }
        [HttpPut("UpdateServices")]
        public async Task<IActionResult> UpdateService(RequestCreateServiceModel requestCreateServiceModel)
        {
            var existedServiceEntity = _unitOfWork.ServiceRepository.GetById(requestCreateServiceModel.Id);
            if (existedServiceEntity != null)
            {
                if(requestCreateServiceModel.file != null)
                {
                    await _imageController.DeleteFileAsync("fpetspaservices", existedServiceEntity.PictureName!);
                    await _imageController.UploadFileAsync(requestCreateServiceModel.file, "fpetspaservices", null);
                    existedServiceEntity.PictureName = requestCreateServiceModel.file.FileName;
                }
                if (requestCreateServiceModel.ServiceName != null) existedServiceEntity.ServiceName = requestCreateServiceModel.ServiceName;
                if (requestCreateServiceModel.Description != null) existedServiceEntity.Description = requestCreateServiceModel.Description;
                if (requestCreateServiceModel.Price != null) existedServiceEntity.Price = requestCreateServiceModel.Price;

            _unitOfWork.ServiceRepository.Update(existedServiceEntity);
                _unitOfWork.Save();
                return Ok();
            }
            return BadRequest();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(String id)
        {
            var existedCategoryEntity = _unitOfWork.ServiceRepository.GetById(id);
            if (existedCategoryEntity != null)
            {
                await _imageController.DeleteFileAsync("fpetspaservices", existedCategoryEntity.PictureName!);
                _unitOfWork.ServiceRepository.Delete(existedCategoryEntity);
                _unitOfWork.Save();
                return Ok();
            }
            return BadRequest();
        }
    }
}
