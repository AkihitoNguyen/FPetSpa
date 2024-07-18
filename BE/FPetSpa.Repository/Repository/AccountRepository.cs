using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Services;
using Google.Apis.Gmail.v1.Data;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Twilio;
using Twilio.Clients;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Rest.Verify.V2.Service;
using Twilio.TwiML.Messaging;
using Twilio.Types;

namespace FPetSpa.Repository.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SendMailServices sendMailServices;

        public AccountRepository(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration, RoleManager<IdentityRole> roleManager, SendMailServices sendMailServices)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
            this.sendMailServices = sendMailServices;
        }
        public async Task<TokenModel> SignInAsync(SignInModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Gmail);
            var passwordValid = await userManager.CheckPasswordAsync(user!, model.Password);
            if (user == null || !passwordValid)
            {
                return null;
            }
            //var result = await signInManager.PasswordSignInAsync(model.Gmail, model.Password, false, false);
            //if(!result.Succeeded)
            //{
            //    return String.Empty;
            //}
            if (userManager.IsEmailConfirmedAsync(user).Result == true)
            {
                var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, model.Gmail),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var userRoles = await userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
                }

                var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
                    (configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: configuration["JWT:ValidIssuer"],
                    audience: configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddMinutes(30),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256));
                var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
                await userManager.SetAuthenticationTokenAsync(user, "JWT", "AccessToken", accessToken);
                await userManager.AddClaimsAsync(user, authClaims!);
                return new TokenModel
                {
                    FullName = user.FullName,
                    AccessToken = accessToken,
                    RefreshToken = GenerateRefeshToken()
                };
            }
            return null;
        }


        public async Task<IdentityResult> SignUpAsync(SignUpModel model)
        {
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                Gmail = model.Gmail,
                UserName = model.Gmail,
                Email = model.Gmail,
                PhoneNumber = "",
                PhoneNumberConfirmed = false
            };
            var resutl = await userManager.CreateAsync(user, model.Password);
            if (resutl.Succeeded)
            {
                //Tao user thanh cong roi se check mail
                var tokenCode = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodeToken = HttpUtility.UrlEncode(tokenCode);

                var callBackUrl = $"https://fpetspa.azurewebsites.net/api/account/confirm-email?token={encodeToken}&id={user.Id}";

                BackgroundJob.Schedule(() => DeleteUnConfirmedUser(user.Id), TimeSpan.FromMinutes(15));
                await sendMailServices.SendEmailAsync(
                    user.Email,
                    "[Confirm your email to active account]",
                    $"Please confirm your email by clicking this link <a href='{callBackUrl}'>Click here</a>"
                    );

                //Kiểm tra role đã có chưa?
                if (!await roleManager.RoleExistsAsync(Role.Customer))
                {
                    await roleManager.CreateAsync(new IdentityRole
                        (Role.Customer));
                }

                await userManager.AddToRoleAsync(user, Role.Customer);
            }
            return resutl;
        }

        public async Task<Boolean> ConfirmMail(string token, string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
            {
                return false;
            }
            //var encodeToken = HttpUtility.UrlDecode(token);
            var result = await userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }

        public async Task<TokenModel> SignInWithGoogle(string gmail, string name)
        {
            var user = await userManager.FindByEmailAsync(gmail);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    Gmail = gmail,
                    UserName = gmail,
                    FullName = name,
                    Email = gmail,
                    EmailConfirmed = true,
                    PhoneNumber = "",
                    PhoneNumberConfirmed = false
                };
                var result = await userManager.CreateAsync(user);

                if (result.Succeeded)
                {
                    if (!await roleManager.RoleExistsAsync(Role.Customer))
                    {
                        await roleManager.CreateAsync(new IdentityRole
                            (Role.Customer));
                    }

                    await userManager.AddToRoleAsync(user, Role.Customer);
                }
            }
            await signInManager.SignInAsync(user, isPersistent: false);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, name),
                new Claim(ClaimTypes.Email, gmail),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
                (configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(30),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256));
            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            await userManager.SetAuthenticationTokenAsync(user, "JWT", "AccessToken", accessToken);
            await userManager.AddClaimsAsync(user, authClaims!);
            return new TokenModel
            {
                FullName = name,
                AccessToken = accessToken,
                RefreshToken = GenerateRefeshToken()
            };
        }

        public async Task DeleteUnConfirmedUser(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user != null && (userManager.IsEmailConfirmedAsync(user).Result == false))
            {
                await userManager.DeleteAsync(user);
            }
        }

        public string GenerateRefeshToken()
        {
            var random = new Byte[32];
            using (var rdnum = RandomNumberGenerator.Create())
            {
                rdnum.GetBytes(random);

                return Convert.ToBase64String(random);
            }

        }

        public async Task<Boolean> logOut(ClaimsPrincipal User)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null)
            {
                return false;
            }
            IEnumerable<Claim> claims = await userManager.GetClaimsAsync(user);
            await userManager.RemoveAuthenticationTokenAsync(user, "JWT", "AccessToken");
            await userManager.RemoveClaimsAsync(user, claims);
            await signInManager.SignOutAsync();
            return true;
        }

        public async Task<IEnumerable> getAllCustomer()
        {
            var customerList = await userManager.GetUsersInRoleAsync(Role.Customer);
            if (customerList != null)
            {
                return customerList;
            }
            return null!;
        }

        public async Task<IEnumerable> getAllAdmin()
        {
            var adminList = await userManager.GetUsersInRoleAsync(Role.Staff);
            if (adminList != null) return adminList;
            return null!;
        }

        public async Task<IdentityResult> SignUpAdmin(SignUpModel model)
        {
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                Gmail = model.Gmail,
                UserName = model.Gmail,
                Email = model.Gmail,
                PhoneNumber = "",
                PhoneNumberConfirmed = false
            };
            var resutl = await userManager.CreateAsync(user, model.Password);
            if (resutl.Succeeded)
            {
                //Tao user thanh cong roi se check mail
                var tokenCode = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodeToken = HttpUtility.UrlEncode(tokenCode);

                var callBackUrl = $"https://fpetspa.azurewebsites.net/api/account/confirm-email?token={encodeToken}&id={user.Id}";


                BackgroundJob.Schedule(() => DeleteUnConfirmedUser(user.Id), TimeSpan.FromMinutes(15));
                await sendMailServices.SendEmailAsync(
                    user.Email,
                    "[Confirm your email to active account]",
                    $"Welcome to our company {model.FullName}," + "<br></br>" +
                    $"Please confirm your email by clicking this link <a href='{callBackUrl}'>Click here</a>" + "<br></br>" +
                    "Let's show out your best performance." + "<br></br>" +
                    "Best Regards."
                    );

                //Kiểm tra role đã có chưa?
                if (!await roleManager.RoleExistsAsync(Role.Staff))
                {
                    await roleManager.CreateAsync(new IdentityRole
                        (Role.Staff));
                }

                await userManager.AddToRoleAsync(user, Role.Staff);
            }
            return resutl;
        }

        public Task<IdentityResult> ForgotPassword(string password)
        {
            return null;
        }

        public async Task<ApplicationUser> GetCustomerByEmail(string mail)
        {
            if (mail != null)
            {
                var user = await userManager.FindByEmailAsync(mail);
                if (user != null) return user;
            }
            return null;
        }

        public async Task<ApplicationUser> GetCustomerById(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                var userList = await userManager.GetUsersInRoleAsync(Role.Customer);
                var result = userList.FirstOrDefault(p => p.Id == id);
                if (result != null) return result;
            }
            return null;
        }

        public async Task<Boolean> SendVerificationCode(string phoneNumber, Guid userId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return false;
            }

            var verificationCode = new Random().Next(100000, 999999).ToString();
                
            TwilioClient.Init("ACafb376ac605551d73af92971182b9a25", "066b8f1330debc674d30e24f6996ac0a");
            var verification = MessageResource.Create(
                     body: $"Your verification code is {verificationCode}",
                     from: new PhoneNumber("+12404938489"),
                     to: new PhoneNumber("+84"+phoneNumber)
            );
            List<Claim> claimList = new List<Claim>
            {
                new Claim("VerificationCode", verificationCode),
                new Claim("TimeExpiredCode", DateTime.UtcNow.AddSeconds(30).ToString())
            };
            user.PhoneNumber = phoneNumber;
            await userManager.UpdateAsync(user);
            await userManager.AddClaimsAsync(user, claimList);
            return true;
        }
        public async Task<Boolean> VerifyPhoneNumber(string Code, Guid userId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return false;
            }

            var claims = await userManager.GetClaimsAsync(user);
            var CodeResult = claims.FirstOrDefault(x => x.Type == "VerificationCode");
            var TimeExpired = claims.FirstOrDefault(x => x.Type == "TimeExpiredCode");
            // Kiểm tra mã xác minh, ví dụ: so sánh với mã đã lưu trong cơ sở dữ liệu hoặc cache
            if (DateTime.Parse(TimeExpired!.Value) > DateTime.UtcNow) return false;
            if (Code == CodeResult!.Value)
            {
               await  userManager.RemoveClaimsAsync(user, claims);
                user.PhoneNumberConfirmed = true;
                await userManager.UpdateAsync(user);
                return true;
            }

            return false;
        }
    }
}
