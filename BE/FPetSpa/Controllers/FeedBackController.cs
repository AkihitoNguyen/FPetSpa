﻿using FPetSpa.Repository.Data;
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
        private readonly IUnitOfWork _unitOfWork;
        public FeedBackController(IUnitOfWork unitOfWork)
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

        //[HttpPut("{id}")]

        //public IActionResult UpdateFeedBack(int id, RequestFeedBackModel requestFeedBackModel)
        //{
        //    var existedFeedBack = _unitOfWork.FeedBackRepository.GetById(id);
        //    if (existedFeedBack != null)
        //    {
        //        existedFeedBack. = requestFeedBackModel.OrderId;
        //        existedFeedBack.PictureName = requestFeedBackModel.PictureName;
        //        existedFeedBack.Star = requestFeedBackModel.Star;
        //        existedFeedBack.Description = requestFeedBackModel.Description;
        //    }
        //    _unitOfWork.FeedBackRepository.Update(existedFeedBack);
        //    _unitOfWork.Save();
        //    return Ok();
        //}
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
