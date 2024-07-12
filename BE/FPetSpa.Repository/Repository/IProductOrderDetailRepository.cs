using FPetSpa.Repository.Data;

namespace FPetSpa.Repository.Repository
{
    interface IProductOrderDetailRepository
    {
        Task<List<ProductOrderDetail>> GetAllAsync();
        Task<ProductOrderDetail> GetByOrderID(string orderId);
    }
}
