namespace FPetSpa.Repository.Services
{
    public interface IOrderServices
    {
        Task<string> GenerateNewOrderIdAsync();
    }

    public class OrderServices : IOrderServices
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderServices(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> GenerateNewOrderIdAsync()
        {
            var lastProduct = (await _unitOfWork.OrderGenericRepo.GetAll()).Where(c => c.OrderId.Substring(0, 3).Equals("ORS"))
                                      .OrderByDescending(p => int.Parse(p.OrderId.Substring(3))) // Sắp xếp theo giá trị số của ProductId
                                      .FirstOrDefault();

            int newIdNumber = 1;
            if (lastProduct != null)
            {
                string lastId = lastProduct.OrderId;
                if (lastId.StartsWith("ORS"))
                {
                    string numberPart = lastId.Substring(3); // Bỏ phần "PRO"
                    if (int.TryParse(numberPart, out int lastNumber))
                    {
                        newIdNumber = lastNumber + 1;
                    }
                }
            }

            return $"ORS{newIdNumber}";
        }

    }
}
