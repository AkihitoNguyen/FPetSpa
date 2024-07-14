using FPetSpa.Models.FeedBackModel;
using FPetSpa.Repository.Data;

namespace FPetSpa.Repository.Services
{
    public interface IFeedBackService
    {
        Task<FeedBack> CreateFeedBack(RequestFeedBackModel requestFeedBackModel);
        void DeleteFeedBack(int id);
        Task<List<FeedBack>> GetAllFeedBack();
        Task<FeedBack> GetFeedBackById(int id);
        Task<List<FeedBack>> GetFeedBackByProductId(string productId);
        Task<FeedBack> UpdateFeedBack(int id, RequestFeedBackModel requestFeedBackModel);
    }
}