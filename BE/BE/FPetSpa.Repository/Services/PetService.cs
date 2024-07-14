

using FPetSpa.Repository.Data;

namespace FPetSpa.Repository.Services
{
    public interface IPetService
    {
        Task<string> GenerateNewPetId();
        Task<IEnumerable<Pet>> SearchPetByName(string petName);
    }
    public class PetService : IPetService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PetService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<string> GenerateNewPetId()
        {
            var lastProduct = (await _unitOfWork.PetRepository.GetAll())
                                      .OrderByDescending(p => Int32.Parse(p.PetId.Substring(3)))
                                      .FirstOrDefault();
            int newIdNumber = 1;
            if (lastProduct != null)
            {
                string lastId = lastProduct.PetId;
                string numberPart = lastId.Substring(3); // Bỏ phần "PET"
                newIdNumber = int.Parse(numberPart) + 1;
            }

            return $"PET{newIdNumber}";
        }
        public async Task<IEnumerable<Pet>> SearchPetByName(string petName)
        {
            return _unitOfWork.PetRepository.Find(p => p.PetName.Contains(petName));
        }
    }
}
