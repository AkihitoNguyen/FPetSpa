using FPetSpa.Repository.Data;
using FPetSpa.Models.FeedBackModel;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using FPetSpa.Repository.Services;
namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedBackController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IFeedBackService _feedBackService;
        public FeedBackController(IFeedBackService feedBackService)
        {

            _feedBackService = feedBackService;
        }
            [HttpGet]
            public async Task<ActionResult<List<FeedBack>>> GetAllFeedBack()
            {
                try
                {
                    var feedbacks = await _feedBackService.GetAllFeedBack();
                    return Ok(feedbacks);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            [HttpGet("id")]
            public async Task<ActionResult<FeedBack>> GetFeedBackById(int id)
            {
                try
                {
                    var feedback = await _feedBackService.GetFeedBackById(id);
                    if (feedback == null)
                    {
                        return NotFound($"Feedback with id {id} not found");
                    }
                    return Ok(feedback);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }

            [HttpGet("productId")]
            public async Task<ActionResult<FeedBack>> GetFeedBackByProductId(string productId)
            {
                try
                {
                    var feedback = await _feedBackService.GetFeedBackByProductId(productId);
                    if (feedback == null)
                    {
                        return NotFound($"Feedback with id {productId} not found");
                    }
                    return Ok(feedback);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }

            [HttpPost("Create")]
            public async Task<ActionResult> CreateFeedBack([FromBody] RequestFeedBackModel feedBack)
            {
                try
                {
                    await _feedBackService.CreateFeedBack(feedBack);
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }

            [HttpPut("Update")]
            public async Task<ActionResult> UpdateFeedBack(int id, [FromBody] RequestFeedBackModel feedBack)
            {
                try
                {

                    await _feedBackService.UpdateFeedBack(id, feedBack);
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }

            [HttpDelete("{id}")]
            public IActionResult DeleteFeedBack(int id)
            {
                try
                {
                    _feedBackService.DeleteFeedBack(id);
                    return Ok();
                }
                catch (ApplicationException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }

    }

