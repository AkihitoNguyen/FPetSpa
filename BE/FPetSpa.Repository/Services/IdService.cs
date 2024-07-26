using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using Microsoft.EntityFrameworkCore;

namespace FPetSpa.Repository.Services
{
    public interface IIdService
    {
        Task<string> GenerateNewServiceIdAsync();
        Task<PetType> GetByTypeNameAsync(string typeName);
        Task<IEnumerable<Service>> GetByPetTypeNameAsync(string petTypeName);
    }

    public class IdService : IIdService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly FpetSpaContext _context;

        public IdService(IUnitOfWork unitOfWork, FpetSpaContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<string> GenerateNewServiceIdAsync()
        {
            var lastService = (await _unitOfWork.ServiceRepository.GetAll())
                       .OrderByDescending(p => Int32.Parse(p.ServiceId.Substring(3))) // Sắp xếp theo phần số
                       .FirstOrDefault();
            int newIdNumber = 1;
            if (lastService != null)
            {
                string lastId = lastService.ServiceId;
                string numberPart = lastId.Substring(3);
                newIdNumber = Int32.Parse(numberPart) + 1;
            }

            return $"SER{newIdNumber}";
        }
        public async Task<PetType> GetByTypeNameAsync(string typeName)
        {
            return await _context.PetType
                .FirstOrDefaultAsync(pt => pt.Type == typeName);
        }

        public async Task<IEnumerable<Service>> GetByPetTypeNameAsync(string petTypeName)
        {
            var petType = await _context.PetType
                .FirstOrDefaultAsync(pt => pt.Type == petTypeName);

            if (petType == null)
            {
                return Enumerable.Empty<Service>();
            }

            return await _context.Services
                .Where(s => s.PetTypeID == petType.Id)
                .ToListAsync();
        }
    }
}
