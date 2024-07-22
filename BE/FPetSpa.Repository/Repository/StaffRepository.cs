using FPetSpa.Repository.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public class StaffRepository
    {
        private readonly FpetSpaContext _context;

        public StaffRepository(FpetSpaContext context)
        {
            _context = context;
        }

        public async Task<StaffStatus> GetFirstStaffByStatus(int status)
        {
            return await _context.Staff
                .FirstOrDefaultAsync(s => s.Status == status);
        }
        public async Task<List<StaffStatus>> GetAllStaff()
        {
            return await _context.Staff.ToListAsync();
        }

        public async Task<StaffStatus> GetStaffById(string id)
        {
            return await _context.Staff.FindAsync(id);
        }
        public async Task<List<StaffStatus>> GetStaffByProductId(string id)
        {
            return await _context.Staff
            .Where(fb => fb.StaffId == id)
            .ToListAsync();
        }
        public async Task CreateStaff(StaffStatus staff)
        {
            await _context.Staff.AddAsync(staff);
            await _context.SaveChangesAsync();
        }

            public async Task UpdateStaffStatus(string id, int status)
            {
                var staff = await _context.Staff.FindAsync(id);
                if (staff != null)
                {
                    staff.Status = status; // Cập nhật trạng thái
                    _context.Staff.Update(staff);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new ApplicationException("Staff not found.");
                }
            }

        public async Task DeleteStaff(string id)
        {
            var staff = await _context.Staff.FindAsync(id); // Sử dụng FindAsync
            if (staff != null)
            {
                _context.Staff.Remove(staff);
                await _context.SaveChangesAsync(); // Sử dụng SaveChangesAsync
            }
        }
    }
}
