using FPetSpa.Models.PetModel;
using FPetSpa.Models.ProductModel;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FPetSpa.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPetService _petService;
        private readonly ImageController _image;

        public PetController(IUnitOfWork unitOfWork, IPetService service, ImageController imageController)
        {
            _unitOfWork = unitOfWork;
            _petService = service;
            _image = imageController;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pet = await _unitOfWork.PetRepository.GetAll();
            if (!pet.IsNullOrEmpty())
            {
                foreach (var item in pet)
                {
                    item.PictureName = await _image.GetLinkByName("petimagefpetspa", item.PictureName!);
                }
                return Ok(pet);
            }
            return BadRequest();
        }
        [HttpGet("{id}")]

        public async Task<IActionResult> GetPetById(String id)
        {
            var responseCategories =  _unitOfWork.PetRepository.GetById(id);
            if(responseCategories != null) 
                {
                var image = await _image.GetLinkByName("petimagefpetspa", responseCategories.PictureName!);
                if (image != null)
                {
                    return Ok(new Pet
                    {
                        CustomerId = responseCategories.CustomerId,
                        PetId = responseCategories.PetId,
                        PetName = responseCategories.PetName,
                        TypeId = responseCategories.TypeId,
                        PetWeight = responseCategories.PetWeight,
                        PictureName = image
                    });
                }

            }
            return BadRequest();
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
                PictureName = requestCreatePetModel.file.FileName ?? "petAvatar.jpg",
                TypeId = requestCreatePetModel.PetType,
                PetWeight = requestCreatePetModel.PetWeight,
            };
            await _image.ImagePet(requestCreatePetModel.file);
            _unitOfWork.PetRepository.Insert(pet);
            _unitOfWork.Save();
            return Ok();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePet(string id, RequestCreatePetModel requestCreatePetModel)
        {
            var existedPet = _unitOfWork.PetRepository.GetById(id);
            if (existedPet != null)
            {
               if(requestCreatePetModel.CustomerId != null) existedPet.CustomerId = requestCreatePetModel.CustomerId;
                if(requestCreatePetModel.PetName != null) existedPet.PetName = requestCreatePetModel.PetName;
                if (requestCreatePetModel.file != null)
                {
                    existedPet.PictureName = requestCreatePetModel.file!.FileName;
                    await _image.UploadFileAsync(requestCreatePetModel.file, "petimagefpetspa", null);
                }
                   if(requestCreatePetModel.PetType != null) existedPet.TypeId = requestCreatePetModel.PetType;
                if(requestCreatePetModel.PetWeight != null)existedPet.PetWeight = requestCreatePetModel.PetWeight;
                _unitOfWork.PetRepository.Update(existedPet);
                _unitOfWork.Save();
                return Ok();
            }
            return BadRequest("Cant not found ID");
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
