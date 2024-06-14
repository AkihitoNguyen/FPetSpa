using FPetSpa.Repository.Model;
using FPetSpa.Repository.Repository;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace FPetSpa.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountRepository accountRepo;

        public AccountsController(IAccountRepository repo)
        {
            accountRepo = repo;
        }
        
        [HttpPost("signup/customer")]
        public async Task<IActionResult> SignUp(SignUpModel signUpModel)
        {
            var result = await accountRepo.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok(result.Succeeded);
            }
            return StatusCode(500);
        }


        [HttpPost("signin/customer")]
        public async Task<IActionResult> SignIn(SignInModel signInModel)
            {
            var result = await accountRepo.SignInAsync(signInModel);
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
                   var token = await accountRepo.SignInWithGoogle(gmail, Name);  
                    return Ok(token);
                }
            }
            return BadRequest("Error logging in with Google");
        }

        [HttpPost("log-out")]
        [Authorize]
        public async Task<IActionResult> logOut()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }
    }
}
