using System;
using System.Collections.Generic;

namespace FPetSpa.Repository.Data;

public partial class FeedBack
{
    public int FeedBackId { get; set; }

    public string? OrderId { get; set; }

    public string? PictureName { get; set; }

    public int? Star { get; set; }

    public string? Description { get; set; }

    public virtual Order? Order { get; set; }
}
