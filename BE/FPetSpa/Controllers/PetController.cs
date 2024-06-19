using FPetSpa.Models.PetModel;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IPetService _petService;
        public PetController(UnitOfWork unitOfWork, IPetService service)
        {
            _unitOfWork = unitOfWork;
            _petService = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pet = await _unitOfWork.PetRepository.GetAll();
            return Ok(pet);
        }
        [HttpGet("{id}")]

        public async Task<IActionResult> GetPetById(String id)
        {
            var responseCategories =  _unitOfWork.PetRepository.GetById(id);
            return Ok(responseCategories);
        }
        [HttpPost]
        public async Task<IActionResult> CreatePet(RequestCreatePetModel requestCreatePetModel)
        {
            var newPetId = await _petService.GenerateNewPetId();
            var pet = new Pet
            {
            
                PetId  = newPetId,
                CustomerId = requestCreatePetModel.CustomerId,
                PetName = requestCreatePetModel.PetName,
                PictureName = requestCreatePetModel.PictureName,
                PetGender = requestCreatePetModel.PetGender,
                PetType = requestCreatePetModel.PetType,
                PetWeight = requestCreatePetModel.PetWeight,
            };
            _unitOfWork.PetRepository.Insert(pet);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpPut("{id}")]
        public IActionResult UpdatePet(string id, RequestCreatePetModel requestCreatePetModel)
        {
            var existedPet = _unitOfWork.PetRepository.GetById(id);
            if (existedPet != null)
            {
                existedPet.CustomerId = requestCreatePetModel.CustomerId;
                existedPet.PetName = requestCreatePetModel.PetName;
                existedPet.PictureName = requestCreatePetModel.PictureName;
                existedPet.PetGender = requestCreatePetModel.PetGender;
                existedPet.PetType = requestCreatePetModel.PetType;
                existedPet.PetWeight = requestCreatePetModel.PetWeight;
            }
            _unitOfWork.PetRepository.Update(existedPet);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpGet("search/{petName}")]
        public async Task<IActionResult> GetPetByName(string petName)
        {
            var Pets = await _petService.SearchPetByName(petName);
            return Ok(Pets);
        }
        [HttpDelete("{id}")]
        public IActionResult DeletePet(string id)
        {
            var existedPet = _unitOfWork.PetRepository.GetById(id);
            _unitOfWork.PetRepository.Delete(existedPet);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
