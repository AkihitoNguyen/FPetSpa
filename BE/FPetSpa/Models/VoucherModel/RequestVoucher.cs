using FPetSpa.Repository.Data;

namespace FPetSpa.Models.VoucherModel
{
    public class RequestVoucher
    {
      
            public string VoucherId { get; set; } = null!;

            public string? Description { get; set; }

            public DateOnly? StartDate { get; set; }

            public DateOnly? EndDate { get; set; }
    }
}
