using FPetSpa.Repository.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public interface IAccountRepository
    {
        public Task<TokenModel> SignInAsync(SignInModel model);
        public Task<IdentityResult> SignUpAsync(SignUpModel model);
        public Task<string> SignInWithGoogle(string gmail, string name);
        public string GenerateRefeshToken();
        public Task<Boolean> logOut(ClaimsPrincipal User);

    }
}
