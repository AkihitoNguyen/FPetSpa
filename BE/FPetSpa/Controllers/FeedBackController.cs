using FPetSpa.Repository.Data;
using FPetSpa.Models.FeedBackModel;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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
        /// <summary>
        /// SortBy (UserFeedBackId = 1,Star = 2)
        /// 
        /// SortType (Ascending = 1,Descending = 2,)        
        /// </summary>
        /// <param name="RequestSearchFeedBackModel"></param>
        /// <returns></returns>
        [HttpGet("SearchFeedback")]
        public async Task<IActionResult> SearchFeedBack([FromQuery] RequestSearchFeedBackModel requestSearchFeedbackModel)
        {
            var sortBy = requestSearchFeedbackModel.SortContent != null ? requestSearchFeedbackModel.SortContent?.sortFeedBackBy.ToString() : null;
            var sortType = requestSearchFeedbackModel.SortContent != null ? requestSearchFeedbackModel.SortContent?.sortFeedBackType.ToString() : null;
            Expression<Func<FeedBack, bool>> filter = x =>
                (string.IsNullOrEmpty(requestSearchFeedbackModel.UserFeedBackId) || x.UserFeedBackId.Contains(requestSearchFeedbackModel.UserFeedBackId)) &&
                x.Star >= requestSearchFeedbackModel.FromStar &&
                (x.Star <= requestSearchFeedbackModel.ToStar || requestSearchFeedbackModel.ToStar == null);
            Func<IQueryable<FeedBack>, IOrderedQueryable<FeedBack>> orderBy = null;

            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortType == SortFeedbackTypeEnum.Ascending.ToString())
                {
                    orderBy = query => query.OrderBy(p => EF.Property<object>(p, sortBy));
                }
                else if (sortType == SortFeedbackTypeEnum.Descending.ToString())
                {
                    orderBy = query => query.OrderByDescending(p => EF.Property<object>(p, sortBy));
                }
            }
            var responseCategorie = _unitOfWork.FeedBackRepository.Get(
                filter,
                orderBy,
                includeProperties: "",
                pageIndex: requestSearchFeedbackModel.pageIndex,
                pageSize: requestSearchFeedbackModel.pageSize
            );


            return Ok(responseCategorie);
        }
        [HttpGet("GetAllFeedBack")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _unitOfWork.FeedBackRepository.GetAll();
            return Ok(result);
        }




    }
}
