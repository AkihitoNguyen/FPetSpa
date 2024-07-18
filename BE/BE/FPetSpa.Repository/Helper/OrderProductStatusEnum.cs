using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Helper
{
    public enum OrderProductStatusEnum
    {
        Pending = 0,
        StaffAccepted = 1,
        Processing = 2,
        Shipped = 3,
        Delivered = 4,
        ReadyForPickup = 5,
<<<<<<< HEAD:BE/BE/FPetSpa.Repository/Helper/OrderProductStatusEnum.cs
        Succesfully = 6
=======
        Succesfully = 6,
        Cancel = 7,
        False = 8
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa.Repository/Helper/OrderProductStatusEnum.cs
    }
}
