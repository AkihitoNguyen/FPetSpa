using FPetSpa.Repository.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services
{
    public class StaffServices : IStaffServices
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly FpetSpaContext _context;
        public StaffServices(IUnitOfWork unitOfWork, FpetSpaContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<List<StaffStatus>> GetAllStaff()
        {
            try
            {
                return await _unitOfWork.StaffRepository.GetAllStaff();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error retrieving staff", ex);
            }
        }

        public async Task<StaffStatus> GetStaffById(string id)
        {
            try
            {
                return await _unitOfWork.StaffRepository.GetStaffById(id);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error retrieving staff by id", ex);
            }
        }
        public async Task<StaffStatus> GetFirstStaffByStatus(int status)
        {
            var staff = await _unitOfWork.StaffRepository.GetFirstStaffByStatus(status);
            return staff; // Lấy phần tử đầu tiên hoặc null nếu không có
        }
        public async Task CreateStaff(StaffStatus staff)
        {
            try
            {
                await _unitOfWork.StaffRepository.CreateStaff(staff);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error creating staff", ex);
            }
        }

        public async Task UpdateStaffStatus(string id, int status)
        {
            try
            {
                await _unitOfWork.StaffRepository.UpdateStaffStatus(id, status);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error updating staff status", ex);
            }
        }

        public async Task DeleteStaff(string id)
        {
            try
            {
                await _unitOfWork.StaffRepository.DeleteStaff(id); // Thêm await
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error deleting staff", ex);
            }
        }

        public async Task<(bool, StaffStatus)> AssignAvailableStaffToOrder(string orderId)
        {
            var availableStaff = await GetFirstStaffByStatus(1); 
            if (availableStaff == null)
            {
                return (false, null); 
            }

            var order = await _unitOfWork.OrderGenericRepo.GetByIdAsync(orderId);
            if (order == null)
            {
                return (false, null); 
            }

            order.StaffId = availableStaff.StaffId;
            availableStaff.Status = 0; 

            await _unitOfWork.SaveChangesAsync();

            return (true, availableStaff);
        }
        public async Task UpdateStaffStatusBasedOnOrder(string orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                throw new ApplicationException("Order not found.");
            }

            if (order.Status == 3 || order.Status == 6)
            {
                if (!string.IsNullOrEmpty(order.StaffId)) 
                {
                    var staff = await _context.Staff.FindAsync(order.StaffId);
                    if (staff != null)
                    {
                        if (staff.Status == 0) 
                        {
                            staff.Status = 1;
                             _context.Staff.Update(staff);
                          await _context.SaveChangesAsync(); 
                        }
                    }
                    else
                    {
                        throw new ApplicationException("Staff not found.");
                    }
                }
            }

        }
    }
}
