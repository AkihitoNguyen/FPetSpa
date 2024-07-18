using FPetSpa.Repository.Data;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services
{
    public class TimeSlotService
    {
        private readonly FpetSpaContext _context;

        public TimeSlotService(FpetSpaContext context)
        {
            _context = context;
        }

        public void CreateSlotWeek()
        {
            var startTime = new TimeSpan(8, 0, 0); // 16:00
            var endTime = new TimeSpan(18, 0, 0); // 20:00
            var interval = new TimeSpan(0, 30, 0); // 20 minutes

            for (int i = 0; i < 7; i++) // Loop through 7 days of the week
            {
                var date = DateTime.Today.AddDays(i);
                var currentSlotTime = startTime;

                while (currentSlotTime < endTime)
                {
                    var timeSlot = new BookingTime
                    {
                         Time = TimeOnly.FromTimeSpan(currentSlotTime),
                        Date = DateOnly.FromDateTime(date),
                        MaxSlots = 10,
                    };
                    _context.BookingTime.Add(timeSlot);
                    currentSlotTime = currentSlotTime.Add(interval);
                }
            }
            _context.SaveChanges();
        }


        // Static method to call CreateSlotWeek
        public static void CreateSlotWeekJob(IServiceProvider services)
        {
            using (var scope = services.CreateScope())
            {
                var timeSlotService = scope.ServiceProvider.GetRequiredService<TimeSlotService>();
                timeSlotService.CreateSlotWeek();
            }
        }
    }


}
