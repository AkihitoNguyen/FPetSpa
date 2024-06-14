using System;
using System.Collections.Generic;

namespace FPetSpa.Repository.Data;

public partial class Cart
{
    public string CartId { get; set; } = null!;

    public string? UserId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual Customer? User { get; set; }
}
