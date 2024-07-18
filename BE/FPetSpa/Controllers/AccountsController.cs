using FPetSpa.Repository;
using FPetSpa.Repository.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Twilio.Types;

namespace FPetSpa.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AccountsController(IUnitOfWork unitOfWork)
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


        [HttpPost("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse(string accessToken)
        {
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required.");
            }

            // Xác thực token với Google
            var client = new HttpClient();
            var requestUri = $"https://www.googleapis.com/oauth2/v3/userinfo?access_token={accessToken}";

            HttpResponseMessage response;
            try
            {
                response = await client.GetAsync(requestUri);
                response.EnsureSuccessStatusCode();
            }
            catch (HttpRequestException e)
            {
                return BadRequest($"Error validating access token: {e.Message}");
            }

            var content = await response.Content.ReadAsStringAsync();
            var userInfo = JObject.Parse(content);

            var email = userInfo.Value<string>("email");
            var fullName = userInfo.Value<string>("name");
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid Google token.");
            }
            if (string.IsNullOrEmpty(fullName))
            {
                return BadRequest("Invalid Google token.");
            }
            var token = await _unitOfWork._IaccountRepository.SignInWithGoogle(email, fullName);
            if(token == null) return BadRequest();
            return Ok(token);
        }
            
        

        [HttpPost("log-out")]
        // [Authorize]
        public async Task<IActionResult> logOut()
        {
            var check = await _unitOfWork._IaccountRepository.logOut(User);
            if (check) return Ok("Log-Out sucessfully");
            return Unauthorized();
        }

        [HttpGet("getAllCustomer")]
        public async Task<IActionResult> gettAllCustomer()
        {
            var cusList = await _unitOfWork._IaccountRepository.getAllCustomer();
            if (cusList != null) return Ok(cusList);
            return BadRequest("Something went wrong in customer list");
        }

        [HttpGet("getAllStaff")]
        public async Task<IActionResult> getAllStaff()
        {
            var staffList = await _unitOfWork._IaccountRepository.getAllAdmin();
            if (staffList != null) return Ok(staffList);
            return BadRequest("Something went wrong in admin list");
        }

        [HttpPost("Signup-staff")]
        public async Task<IActionResult> signUpStaff(SignUpModel model)
        {
            var result = await _unitOfWork._IaccountRepository.SignUpAdmin(model);
            if (result.Succeeded) return Ok("Please check mail to confirm the staff account....");
            return BadRequest("Something went wrong!!! Please try again.....");
        }


        [HttpGet("getUserById")]
        public async Task<IActionResult> getCustomerById(string id)
        {
            var result = await _unitOfWork._IaccountRepository.GetCustomerById(id);
            if (result != null) return Ok(result);
            return BadRequest("Not Found");
        }
        [HttpGet("getUserByMail")]
        public async Task<IActionResult> getCustomerByMail(string mail)
        {
            if (string.IsNullOrEmpty(mail)) return BadRequest(string.Empty);
            var result = await _unitOfWork._IaccountRepository.GetCustomerByEmail(mail);
            if (result != null) return Ok(result);
            return NotFound();
        }
        [HttpPost("send-verification-code")]
        public async Task<IActionResult> SendVerificationCode(string phone, Guid UserId)
        {
            if (UserId.ToString() == null && phone == null)
            {
                return NotFound("User not found");
            }
            var result = await _unitOfWork._IaccountRepository.SendVerificationCode(phone, UserId);
            if (result == true) return Ok("Verification code sent");
            return BadRequest();
        }
        [HttpPost("verify-phone-number")]
        public async Task<IActionResult> VerifyPhoneNumber(string Code, Guid UserId)
        {
            if (UserId.ToString() == null && Code == null)
            {
                return NotFound("User not found");
            }
            var result = await _unitOfWork._IaccountRepository.VerifyPhoneNumber(Code, UserId);
            if (result == true) return Ok("Verify successfully");
            return BadRequest("Invalid or expired verification code");
        }
    }
}

