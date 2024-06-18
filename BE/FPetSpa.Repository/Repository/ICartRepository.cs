using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;

namespace FPetSpa.Repository.Repository
{
    public interface ICartRepository
    {
        Task AddAsync(AddToCartModel request);
        void DeleteCart(Cart cart);
        Task<IEnumerable<Cart>> GetAllAsync();
        Task<Cart> GetByIdAsync(string id);
    }
}