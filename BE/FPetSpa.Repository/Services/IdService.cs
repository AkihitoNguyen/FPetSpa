namespace FPetSpa.Repository.Services
{
    public interface IIdService
    {
        Task<string> GenerateNewServiceIdAsync();
    }

    public class IdService : IIdService
    {
        private readonly IUnitOfWork _unitOfWork;

        public IdService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

    }
}
