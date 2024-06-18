using FPetSpa.Repository.Data;
using FPetSpa.Models.FeedBackModel;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedBackController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        public FeedBackController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
    
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _unitOfWork.FeedBackRepository.GetAll();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public IActionResult GetFeedBackById(int id)
        {
            var responseCategories = _unitOfWork.FeedBackRepository.GetById(id);
            return Ok(responseCategories);
        }
        //[HttpPost]
        //public IActionResult CreateFeedBackk(RequestFeedBackModel requestFeedBackModel)
        //{
        //    var feedback = new FeedBack
        //    {
        //        UserFeedBackId = requestFeedBackModel.UserId,
        //        PictureName = requestFeedBackModel.PictureName,
        //        Star = requestFeedBackModel.Star,
        //        Description = requestFeedBackModel.Description,
            
        //    };
        //    _unitOfWork.FeedBackRepository.Insert(feedback);
        //    _unitOfWork.Save();
        //    return Ok();
        //}
        [HttpPut("{id}")]

        public IActionResult UpdateFeedBack(int id, RequestFeedBackModel requestFeedBackModel)
        {
            var existedFeedBack = _unitOfWork.FeedBackRepository.GetById(id);
            if (existedFeedBack != null)
            {
                existedFeedBack.OrderId = requestFeedBackModel.OrderId;
                existedFeedBack.PictureName = requestFeedBackModel.PictureName;
                existedFeedBack.Star = requestFeedBackModel.Star;
                existedFeedBack.Description = requestFeedBackModel.Description;
            }
            _unitOfWork.FeedBackRepository.Update(existedFeedBack);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteFeedBack(int id)
        {
            var existedCategory = _unitOfWork.FeedBackRepository.GetById(id);
            _unitOfWork.FeedBackRepository.Delete(existedCategory);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
