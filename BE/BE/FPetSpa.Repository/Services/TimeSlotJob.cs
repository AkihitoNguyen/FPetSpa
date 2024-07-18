using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services
{
    public class TimeSlotJob
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public TimeSlotJob(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public void CreateSlotWeekJob()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var timeSlotService = scope.ServiceProvider.GetRequiredService<TimeSlotService>();
                timeSlotService.CreateSlotWeek();
            }
        }
    }

}
