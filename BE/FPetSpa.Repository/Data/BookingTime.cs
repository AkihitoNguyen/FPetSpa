using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Data
{
    public class BookingTime
    {
        public int Id { get; set; }
        public TimeOnly Time {  get; set; }
        public DateOnly Date {  get; set; }
        public int MaxSlots { get; set; }

    }
}
