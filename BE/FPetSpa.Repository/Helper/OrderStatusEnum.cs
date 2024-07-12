using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Helper
{
    public enum OrderStatusEnum
    {
        Pending = 0,
        Processing = 1,
        StaffAccepted = 2,
        Sucessfully = 3,
        Cancel = 4,
        False = 5
    }
}
