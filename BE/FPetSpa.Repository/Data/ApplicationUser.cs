using Microsoft.AspNetCore.Identity;
using Twilio.Types;

namespace FPetSpa.Repository.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = null!;
        public string Gmail { get; set; } = null!;
        public string? PhoneNumber { get; set; } = null!;
        public bool? PhoneNumberConfirmed { get; set; } = false;
        public string? Image {  get; set; } = null!;

    }
}
