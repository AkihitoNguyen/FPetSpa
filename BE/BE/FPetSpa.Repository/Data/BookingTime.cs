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
<<<<<<< HEAD:BE/BE/FPetSpa.Repository/Data/BookingTime.cs
        public string Time {  get; set; }
=======
        public TimeOnly Time {  get; set; }
        public DateOnly Date {  get; set; }
        public int MaxSlots { get; set; }

>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa.Repository/Data/BookingTime.cs
    }
}
