﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Helper
{
    public enum OrderProductStatusEnum
    {
        Pending = 0,
        PreparingOrder = 1,
        Delivering = 2,
        Shipped = 3,
        Delivered = 4,
        ReadyForPickup = 5,
        Succesfully = 6,
        Cancel = 7,
        False = 8
    }
}
