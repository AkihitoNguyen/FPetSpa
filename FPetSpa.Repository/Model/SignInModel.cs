using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
