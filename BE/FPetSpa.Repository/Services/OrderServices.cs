using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace FPetSpa.Repository.Services
{
    public interface IOrderServices
    {
        Task<string> GenerateNewOrderIdAsync();
        Task<bool> AssignStaffToOrderAsync(string orderId, string staffId);
        Task<IEnumerable<ApplicationUser>> getAllStaff();
    }

    public class OrderServices : IOrderServices
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;


        public OrderServices(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _unitOfWork = unitOfWork;

            _userManager = userManager;
            _roleManager = roleManager;
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
        public async Task<IEnumerable<ApplicationUser>> getAllStaff()
        {
            var staffList = await _userManager.GetUsersInRoleAsync(Role.Staff);
            return staffList;
        }

        public async Task<bool> AssignStaffToOrderAsync(string orderId, string staffId)
        {
            var order = _unitOfWork.OrderGenericRepo.GetById(orderId);
            if (order == null) return false;

            var staffList = await _userManager.GetUsersInRoleAsync(Role.Staff); // Đã sử dụng kiểu cụ thể
            var staff = staffList.FirstOrDefault(s => s.Id.Equals(staffId, StringComparison.OrdinalIgnoreCase));
            if (staff == null) return false;

            order.StaffId = staff.Id;
            _unitOfWork.OrderGenericRepo.Update(order);
             _unitOfWork.Save();

            return true;
        }


    }

}

