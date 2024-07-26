using FPetSpa.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetTypeController : ControllerBase
    {
        private IUnitOfWork _unitOfWork;
        public PetTypeController(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpGet("GetAllPetTypes")]
        public async Task<IActionResult> getAllType()
        {
            var result = await _unitOfWork.PetType.GetAll();
            if(!result.IsNullOrEmpty()) return Ok(result);
            return BadRequest();
        }

        [HttpPost("AddTypes")]
        public async Task<IActionResult> AddTypes(string Type)
        {
            if(Type.IsNullOrEmpty()) return BadRequest();
            else
            {
                _unitOfWork.PetType.Insert(new Repository.Data.PetType() { Type = Type } );
                await _unitOfWork.SaveChangesAsync();
                return Ok("Add successfully");
            }
        }

        [HttpPut("UpdateTypeByOldType")]
        public async Task<IActionResult> UpdateTypes(string oldType, string newType)
        {
            if(!oldType.IsNullOrEmpty() && !newType.IsNullOrEmpty())
            {
                var specificValue = _unitOfWork.PetType.GetAll().Result.FirstOrDefault(x => x.Type.ToLower().Equals(oldType.ToLower()));    
                if(specificValue != null)
                {
                    specificValue.Type = newType;
                    _unitOfWork.PetType.Update(specificValue);
                    await _unitOfWork.SaveChangesAsync();
                    return Ok();
                }
            };
            return BadRequest(); 
        }

        [HttpPut("UpdateTypeById")]
        public async Task<IActionResult> UpdateTypesById(int id,  string newType)
        {
            if (id > 0 && !newType.IsNullOrEmpty())
            {
                var specificValue = _unitOfWork.PetType.GetById(id);
                if (specificValue != null)
                {
                    specificValue.Type = newType;
                    _unitOfWork.PetType.Update(specificValue);
                    await _unitOfWork.SaveChangesAsync();
                    return Ok();
                }
            };
            return BadRequest();
        }

        [HttpDelete("DeleteTypeById")]
        public async Task<IActionResult> DeleteType(int id)
        {
            if (id > 0)
            {
                var specificValue = _unitOfWork.PetType.GetById(id);
                if (specificValue != null)
                {
                    _unitOfWork.PetType.Delete(specificValue);
                    await _unitOfWork.SaveChangesAsync();
                    return Ok();
                }
            };
            return BadRequest();
        }

        [HttpPut("DeleteByType")]
        public async Task<IActionResult> DeleteByType(string Type)
        {
            if (!Type.IsNullOrEmpty())
            {
                var specificValue = _unitOfWork.PetType.GetAll().Result.FirstOrDefault(x => x.Type.ToLower().Equals(Type.ToLower()));
                if (specificValue != null)
                {
                    _unitOfWork.PetType.Delete(specificValue);
                    await _unitOfWork.SaveChangesAsync();
                    return Ok();
                }
            };
            return BadRequest();
        }
    }

}
