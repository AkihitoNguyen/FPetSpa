using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using Microsoft.AspNetCore.Identity;
using System.Collections;
using System.Security.Claims;
using Twilio.Types;

namespace FPetSpa.Repository.Repository
{
    public interface IAccountRepository
    {
        public Task<TokenModel> SignInAsync(SignInModel model);
        public Task<IdentityResult> SignUpAsync(SignUpModel model);
        public Task<TokenModel> SignInWithGoogle(string gmail, string name);
        public string GenerateRefeshToken();
        public Task<Boolean> logOut(ClaimsPrincipal User);
        public Task<Boolean> ConfirmMail(string token, string mail);
        public Task<IEnumerable> getAllCustomer();
        public Task<IEnumerable> getAllAdmin();
        public Task<IdentityResult> SignUpAdmin(SignUpModel admin);
        public Task<IdentityResult> ForgotPassword(string email);
        public Task<IdentityResult> ResetPasswordForget(string mail, string password, string token);
        public Task<ApplicationUser> GetCustomerByEmail(string mail);
        public Task<ApplicationUser> GetCustomerById(string mail);
        public Task<Boolean> SendVerificationCode(string phone, Guid userId);
        public Task<Boolean> VerifyPhoneNumber(string Code, Guid userId);
        public Task<IdentityResult> ChangePasswork(string email, string passwordOld, string passworkNew);
        public Task<IdentityResult> RemoveAccount(string email, string password);
    }
}
