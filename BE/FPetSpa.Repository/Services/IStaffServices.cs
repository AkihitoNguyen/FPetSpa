using FPetSpa.Repository.Data;

namespace FPetSpa.Repository.Services
{
    public interface IStaffServices
    {
        Task CreateStaff(StaffStatus staff);
        Task DeleteStaff(string id);
        Task<List<StaffStatus>> GetAllStaff();
        Task<StaffStatus> GetStaffById(string id);
        Task<StaffStatus> GetFirstStaffByStatus(int status);
        Task UpdateStaffStatus(string id, int status);
        Task<(bool, StaffStatus)> AssignAvailableStaffToOrder(string orderId);
        Task UpdateStaffStatusBasedOnOrder(string orderId);


    }
}