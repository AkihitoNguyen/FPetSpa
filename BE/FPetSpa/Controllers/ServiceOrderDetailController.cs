using FPetSpa.Models.OrderModel;
using FPetSpa.Models.ServiceModel;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model.ServiceOrderDetailModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceOrderDetailController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ImageController _image;

        public ServiceOrderDetailController(IUnitOfWork unitOfWork, ImageController imageController)
        {
            _unitOfWork = unitOfWork;
            _image = imageController;
        }
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var serviceOrder = await _unitOfWork.ServiceOrderDetailRepository.GetAllAsync();
            return Ok(serviceOrder);
        }


        [HttpGet("{orderId}&{serviceId}")]
        public async Task<IActionResult> GetByOrderID(string orderId, string serviceId)
        {
            var serviceOrderDetails = await _unitOfWork.ServiceOrderDetailRepository.GetByOrderID(orderId, serviceId);
            return Ok(serviceOrderDetails);
        }

        [HttpGet("getServiceDetailByOrderId")]
        public async Task<IActionResult> GetOrderServiceDetail(string orderId)
        {
            var serviceOrderDetails = _unitOfWork.ServiceOrderDetailRepository.GetAllAsync().Result.Where(x => x.OrderId == orderId);
            var order = _unitOfWork.OrderGenericRepo.GetById(orderId);
            if (!serviceOrderDetails.IsNullOrEmpty() && order != null)
            {
                var result = serviceOrderDetails.Select(async x => new ResponseSearchModelCustom
                {
                    ServicesId = x.ServiceId!,
                    ServiceName = _unitOfWork.ServiceRepository.GetByIdAsync(x.ServiceId).Result.ServiceName ?? "Service Removed",
                    PictureServices = await _image.GetLinkByName("fpetspaservices", _unitOfWork.ServiceRepository.GetById(x.ServiceId!).PictureName!) ?? await _image.GetLinkByName("errorbuckett", "avatar.png"),
                    Price = x.Price!.Value,
                    BookingTime = order.BookingTime ?? null,
                    TransactionDate =  _unitOfWork.TransactionRepository.GetById(order.TransactionId).TransactionDate ?? null,
                });
                return Ok(await Task.WhenAll(result));
            }
            return BadRequest();
        }

        [HttpDelete("{orderId}&{serviceId}")]
        public async Task<IActionResult> DeleteService(string orderId, string serviceId)
        {
            var existedCategoryEntity = await _unitOfWork.ServiceOrderDetailRepository.GetByOrderID(orderId, serviceId);

            if (existedCategoryEntity == null)
            {
                return NotFound(new { Message = $"Order with ID {orderId} not found." });
            }

            await _unitOfWork.ServiceOrderDetailRepository.DeleteById(orderId, serviceId);
            _unitOfWork.Save();

            return Ok(new { Message = "Order deleted successfully." });
        }


        [HttpPut("{orderId}&{serviceId}")]
        public async Task<IActionResult> UpdateService(string orderId, string serviceId, [FromBody] RequestUpdateServiceOrderDetail newPetId)
        {
            try
            {
                // Kiểm tra nếu dữ liệu mới về PetId là null
                if (newPetId.PetId == null)
                {
                    return BadRequest("New PetID is required.");
                }

                await _unitOfWork.ServiceOrderDetailRepository.UpdatePetById(orderId, serviceId, newPetId.PetId);
                _unitOfWork.Save(); // Lưu thay đổi
                return Ok("Service order detail PetId updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("CreateServiceOrderDetail")]
        public async Task<IActionResult> CreateServiceOrderDetail(RequestCreateServiceOrderDetail request)
        {
            if (request.PetWeight <= 0)
            {
                return BadRequest("Must input PetWeight");
            }
            if (request.Price <= 0)
            {
                return BadRequest("Must input price");
            }

            await _unitOfWork.ServiceOrderDetailRepository.AddServiceOrderDetailAsync(
               request.ServiceId,
               request.OrderId,
               request.Discount ?? 0,
               request.PetWeight.Value,
               request.Price.Value,
               request.PetId);
            _unitOfWork.Save();
            return Ok("Service order detail added successfully.");

        }
       
    }

}
