using System;
using System.Collections.Generic;

namespace FPetSpa.Data;

public partial class Staff
{
    public int StaffId { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public DateOnly? Birthday { get; set; }

    public int? Role { get; set; }

    public string? PictureName { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
