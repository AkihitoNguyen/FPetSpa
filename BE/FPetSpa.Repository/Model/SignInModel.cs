using System.ComponentModel.DataAnnotations;

namespace FPetSpa.Repository.Model
{
    public class SignInModel
    {
        [Required, EmailAddress]
        public string Gmail { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
