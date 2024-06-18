using FPetSpa.Repository.Model;
using FPetSpa.Repository.Repository;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using FPetSpa.Repository;

namespace FPetSpa.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public AccountsController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        [HttpPost("signup/customer")]
        public async Task<IActionResult> SignUp(SignUpModel signUpModel)
        {
            var result = await _unitOfWork._IaccountRepository.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok("Registration successful. Please check your email to confirm your account.");
            }
            return StatusCode(500);
        }
            
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmMail(string token, string id)
        {
            var result = await _unitOfWork._IaccountRepository.ConfirmMail(token, id);
            if (result)
            {
                await _unitOfWork.SaveChangesAsync();
                return Ok("Email confirmed successfully.");
            }
            return BadRequest("Invalid email.");
        }


        [HttpPost("signin/customer")]
        public async Task<IActionResult> SignIn(SignInModel signInModel)
            {
            var result = await _unitOfWork._IaccountRepository.SignInAsync(signInModel);
            if (result == null)
            {
                return Unauthorized();
            }
            return Ok(result);
        }

        [HttpGet("login-google")]
        public IActionResult Login()
        {
            var authenticationProperties = new AuthenticationProperties { RedirectUri = Url.Action("GoogleResponse") };
            return Challenge(authenticationProperties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("signin-google")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if(result?.Principal != null)
            {
                var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
                var Name = claims?.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Name)?.Value;
                var gmail = claims?.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
                if (gmail != null)
                {
                   var token = await _unitOfWork._IaccountRepository.SignInWithGoogle(gmail, Name);  
                    return Ok(token);
                }
            }
            return BadRequest("Error logging in with Google");
        }

        [HttpPost("log-out")]
       // [Authorize]
        public async Task<IActionResult> logOut()
        {
            var check = await _unitOfWork._IaccountRepository.logOut(User);
            if (check) return Ok("Log-Out sucessfully");
            return Unauthorized();
        }
    }
}
