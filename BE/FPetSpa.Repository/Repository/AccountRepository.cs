using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Services;
using GoogleApi.Entities.Search.Common;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
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
        private readonly FpetSpaContext context;
        public AccountRepository(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration, RoleManager<IdentityRole> roleManager, SendMailServices sendMailServices, FpetSpaContext spaContext)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
            this.sendMailServices = sendMailServices;
            this.context = spaContext;

        }
        public async Task<TokenModel> SignInAsync(SignInModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Gmail);
            var passwordValid = await userManager.CheckPasswordAsync(user!, model.Password);
            if (user == null || !passwordValid)
            {
                return null;
            }
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
                PhoneNumberConfirmed = false,
                Image = "avatar.jpg"
            };
            var resutl = await userManager.CreateAsync(user, model.Password);
            if (resutl.Succeeded)
            {
                //Tao user thanh cong roi se check mail
                var tokenCode = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodeToken = HttpUtility.UrlEncode(tokenCode);

                var callBackUrl = $"https://fpetspa.azurewebsites.net/api/account/confirm-email?token={encodeToken}&id={user.Id}";

                BackgroundJob.Schedule(() => DeleteUnConfirmedUser(user.Id), TimeSpan.FromMinutes(15));
                var bodyHtml = this.bodyConfirmMail(callBackUrl);
                await sendMailServices.SendEmailAsync(
                    user.Email,
                    "[Confirm your email to active account]",
                    bodyHtml
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
                    PhoneNumberConfirmed = false,
                    Image = "avatar.jpg"

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
                PhoneNumberConfirmed = false,
                Image = "avatar.jpg"

            };
            var resutl = await userManager.CreateAsync(user, model.Password);
            if (resutl.Succeeded)
            {
                //Tao user thanh cong roi se check mail
                var staff = await userManager.FindByEmailAsync(user.Gmail);
                await context.Staff.AddAsync(new StaffStatus
                {
                    StaffId = staff.Id,
                    StaffName = staff.FullName,
                    Status = 0
                });
                var tokenCode = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodeToken = HttpUtility.UrlEncode(tokenCode);

                var callBackUrl = $"https://fpetspa.azurewebsites.net/api/account/confirm-email?token={encodeToken}&id={user.Id}";


                BackgroundJob.Schedule(() => DeleteUnConfirmedUser(user.Id), TimeSpan.FromMinutes(15));
                var bodyHtml = this.bodyConfirmMail(callBackUrl);
                await sendMailServices.SendEmailAsync(
                    user.Email,
                    "[Confirm your email to active account]",
                     bodyHtml
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


            TwilioClient.Init("ACafb376ac605551d73af92971182b9a25", "67be8029e7dee40160e122261aff25fb");
            var verification = MessageResource.Create(
                     body: $"Your verification code is {verificationCode}",
                     from: new PhoneNumber("+12404938489"),
                     to: new PhoneNumber("+84" + phoneNumber)
            );
            List<Claim> claimList = new List<Claim>
            {
                new Claim("VerificationCode"+user.Id, verificationCode),
                new Claim("TimeExpiredCode"+user.Id, DateTime.UtcNow.AddSeconds(30).ToString())
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
            var CodeResult = claims.FirstOrDefault(x => x.Type == "VerificationCode" + user.Id);
            var TimeExpired = claims.FirstOrDefault(x => x.Type == "TimeExpiredCode" + user.Id);
            // Kiểm tra mã xác minh, ví dụ: so sánh với mã đã lưu trong cơ sở dữ liệu hoặc cache
            if (DateTime.Parse(TimeExpired!.Value) > DateTime.UtcNow) return false;
            if (Code == CodeResult!.Value)
            {
                await userManager.RemoveClaimsAsync(user, claims);
                user.PhoneNumberConfirmed = true;
                await userManager.UpdateAsync(user);
                return true;
            }

            return false;
        }

        public async Task<IdentityResult> ForgotPassword(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null) return null;
            else
            {
                var verificationCode = new Random().Next(1000, 9999).ToString();
                var bodyHtml = this.FormSetPasswork(verificationCode);
                await sendMailServices.SendEmailAsync(
                    user.Email,
                    "[ResetPassword]",
                   bodyHtml
                    );
                Claim claims = new Claim($"RESETPASSWORK{email}", verificationCode);
                await userManager.AddClaimAsync(user, claims);
                BackgroundJob.Schedule(() => RemoveUserClaimAsync(user.Id, claims.Type, claims.Value), TimeSpan.FromSeconds(45));
                return IdentityResult.Success;
            }
        }

        public async Task RemoveUserClaimAsync(string userId, string claimType, string claimValue)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var claim = new Claim(claimType, claimValue);
                await userManager.RemoveClaimAsync(user, claim);
            }
        }



        public async Task<IdentityResult> CheckCodeResetPasswork(string email, string code)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var listClaims = userManager.GetClaimsAsync(user).Result.FirstOrDefault(x => x.Type.Equals($"RESETPASSWORK{email}"));
                if (listClaims != null)
                {
                    listClaims.Value.Equals(code);
                    return IdentityResult.Success;
                }

            }
            return null;
        }

        public async Task<IdentityResult> ResetPassword(string email, string password)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user != null)
            {
                user.PasswordHash =  userManager.PasswordHasher.HashPassword(user, password);
                await userManager.UpdateAsync(user);
                return IdentityResult.Success;
            }
            return null;
        }


        public async Task<IdentityResult> RemoveAccount(string email, string password)
        {
            var user = await userManager.FindByNameAsync(email);
            if (user != null)
            {
                var check = await userManager.CheckPasswordAsync(user, password);
                if (check == true)
                {
                    var result = await userManager.DeleteAsync(user);
                    if (result.Succeeded) return IdentityResult.Success;
                }
            }
            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> ChangePasswork(string email, string passwordOld, string passworkNew)
        {
            var user = await userManager.FindByNameAsync(email);
            if (user != null)
            {
                var check = await userManager.ChangePasswordAsync(user, passwordOld, passworkNew);
                if (check.Succeeded) return IdentityResult.Success;
            }
            return IdentityResult.Failed();
        }



        public string FormSetPasswork(string Code)
        {
            return $@"<!doctype html><html lang=""und"" dir=""auto"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office""><head><title></title><!--[if !mso]><!--><meta http-equiv=""X-UA-Compatible"" content=""IE=edge""><!--<![endif]--><meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""><style type=""text/css"">#outlook a {{ padding:0; }}
      body {{ margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }}
      table, td {{ border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }}
      img {{ border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }}
      p {{ display:block;margin:13px 0; }}</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type=""text/css"">
      .mj-outlook-group-fix {{ width:100% !important; }}
    </style>
    <![endif]--><style type=""text/css"">@media only screen and (min-width:480px) {{
        .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
      }}</style><style media=""screen and (min-width:480px)"">.moz-text-html .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}</style><style type=""text/css"">@media only screen and (max-width:479px) {{
      table.mj-full-width-mobile {{ width: 100% !important; }}
      td.mj-full-width-mobile {{ width: auto !important; }}
    }}</style><style type=""text/css"">@media (max-width: 479px) {{
.hide-on-mobile {{
display: none !important;
}}
}}
.gr-mlimage-kjsksc img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-kgfaoq {{
height: 149px !important;
}}
}}
.gr-mltext-ehmlrj a,
.gr-mltext-ehmlrj a:visited {{
text-decoration: none;
}}
.gr-mlimage-kjsksc img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-yxoypl {{
height: 388.59999999999997px !important;
}}
}}
.gr-mlimage-kjsksc img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-ewjlok {{
height: 59px !important;
}}
}}
.gr-mltext-defkoy a,
.gr-mltext-defkoy a:visited {{
text-decoration: none;
}}
.gr-mlbutton-pdkmix p {{
direction: ltr;
}}
.gr-footer-pesbmr a,
.gr-footer-pesbmr a:visited {{
color: #AB0FA2;
text-decoration: underline;
}}</style><link href=""https://fonts.googleapis.com/css?display=swap&family=Oswald:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese"" rel=""stylesheet"" type=""text/css""><style type=""text/css"">@import url(https://fonts.googleapis.com/css?display=swap&family=Oswald:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese);</style></head><body style=""word-spacing:normal;background-color:#FFFFFF;""><div style=""background-color:#FFFFFF;"" lang=""und"" dir=""auto""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:10px 40px 5px 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px 0 20px 0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-mlimage-kjsksc gr-mlimage-kgfaoq"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:171px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/dd5dae84-f292-41a4-ade5-718039b89d6c.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""171"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px 0 20px 0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""left"" class=""gr-mltext-fmbgbx gr-mltext-ehmlrj"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #FFFFFF""><span style=""font-size: 40px""><span style=""font-family: Oswald, Arial, sans-serif"">Thank you for using our website</span></span></span></p></div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-mlimage-kjsksc gr-mlimage-yxoypl"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:580px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/7e94eb91-2527-4738-a9a9-66bea0054a11.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""580"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-mlimage-kjsksc gr-mlimage-ewjlok"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:580px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/49d7d924-fd06-46ce-80b8-42b08c95a79e.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""580"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""left"" class=""gr-mltext-fmbgbx gr-mltext-defkoy"" style=""font-size:0px;padding:0 46px 0 36px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #353535""><span style=""font-size: 22px""><span style=""font-family: Oswald, Arial, sans-serif"">Here is your code</span></span></span></p></div></div></td></tr><tr><td align=""center"" style=""font-size:0px;padding:20px 40px 30px 40px;word-break:break-word;""><p style=""border-top:dashed 1px #7F7F7F;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:dashed 1px #7F7F7F;font-size:1px;margin:0px auto;width:500px;"" role=""presentation"" width=""500px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td align=""center"" class=""gr-mlbutton-jimoec gr-mlbutton-pdkmix link-id-a3f3d3351854"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""transparent"" role=""presentation"" style=""border:none;border-bottom:2px solid #AB0FA2;border-left:2px solid #AB0FA2;border-radius:5px;border-right:2px solid #AB0FA2;border-top:2px solid #AB0FA2;cursor:auto;font-style:normal;mso-padding-alt:16px 28px;background:transparent;word-break:break-word;"" valign=""middle""><p style=""display:inline-block;background:transparent;color:#AB0FA2;font-family:Oswald, Arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:16px 28px;mso-padding-alt:0px;border-radius:5px;"">{Code}</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:10px solid #AB0FA2;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:20px 5px 5px 5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:5px;word-break:break-word;""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" ><tr><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-64f1dafd548a""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://facebook.com"" target=""_blank""><img alt=""facebook"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/facebook4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-e874522405d7""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://twitter.com"" target=""_blank""><img alt=""twitter"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/twitter4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-dc0e55f891f2""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://instagram.com"" target=""_blank""><img alt=""instagram"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/instagram4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-459f6780665e""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://youtube.com"" target=""_blank""><img alt=""youtube"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/youtube4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-footer-unfpsn gr-footer-pesbmr"" style=""font-size:0px;padding:10px;word-break:break-word;""><div style=""font-family:Roboto, Arial, sans-serif;font-size:10px;font-style:normal;line-height:1;text-align:center;text-decoration:none;color:#818E9B;""><div>, 40C, 70000, Ho Chi Minh City, Công Hòa Xã Hội Chủ Nghĩa Việt Nam<br><br>Bạn có thể <a href=""https://app.getresponse.com/unsubscribe.html?x=a62b&m=E&mc=JL&s=E&u=VEjc9&z=EECCyYN&pt=unsubscribe"" target=""_blank"">hủy đăng ký</a> hoặc <a href=""https://app.getresponse.com/change_details.html?x=a62b&m=E&s=E&u=VEjc9&z=EVHFzen&pt=change_details"" target=""_blank"">thay đổi thông tin liên hệ</a> bất cứ lúc nào.</div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--><table align=""center"" style=""font-family: 'Roboto', Helvetica, sans-serif; font-weight: 400; letter-spacing: .018em; text-align: center; font-size: 10px;""><tr><td style=""padding-bottom: 20px""><br /><div style=""color: #939598;"">Cung cấp bởi:</div><a href=""https://app.getresponse.com/referral.html?x=a62b&c=Z2q4h&u=VEjc9&z=EwoGQV6&""><img src=""https://app.getresponse.com/images/common/templates/badges/gr_logo_2.png"" alt=""GetResponse"" border=""0"" style=""display:block;"" width=""120"" height=""24""/></a></td></tr></table></div></body></html>";
        }


        public string bodyConfirmMail(string link)
        {
            return $@"<!doctype html><html lang=""und"" dir=""auto"" xmlns=""http://www.w3.org/1999/xhtml"" xmlns:v=""urn:schemas-microsoft-com:vml"" xmlns:o=""urn:schemas-microsoft-com:office:office""><head><title></title><!--[if !mso]><!--><meta http-equiv=""X-UA-Compatible"" content=""IE=edge""><!--<![endif]--><meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""><style type=""text/css"">#outlook a {{ padding:0; }}
      body {{ margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }}
      table, td {{ border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }}
      img {{ border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }}
      p {{ display:block;margin:13px 0; }}</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type=""text/css"">
      .mj-outlook-group-fix {{ width:100% !important; }}
    </style>
    <![endif]--><style type=""text/css"">@media only screen and (min-width:480px) {{
        .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}
      }}</style><style media=""screen and (min-width:480px)"">.moz-text-html .mj-column-per-100 {{ width:100% !important; max-width: 100%; }}</style><style type=""text/css"">@media only screen and (max-width:479px) {{
      table.mj-full-width-mobile {{ width: 100% !important; }}
      td.mj-full-width-mobile {{ width: auto !important; }}
    }}</style><style type=""text/css"">@media (max-width: 479px) {{
.hide-on-mobile {{
display: none !important;
}}
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-behldb {{
height: 149px !important;
}}
}}
.gr-mltext-mwfchd a,
.gr-mltext-mwfchd a:visited {{
text-decoration: none;
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-ayyirr {{
height: 388.59999999999997px !important;
}}
}}
.gr-mlimage-vpxdmh img {{
box-sizing: border-box;
}}
@media (min-width: 480px) {{
.gr-mlimage-pkjelf {{
height: 59px !important;
}}
}}
.gr-mltext-wxixmm a,
.gr-mltext-wxixmm a:visited {{
text-decoration: none;
}}
.gr-mlbutton-xcuxvp p {{
direction: ltr;
}}
.gr-footer-pnfuxj a,
.gr-footer-pnfuxj a:visited {{
color: #AB0FA2;
text-decoration: underline;
}}</style><link href=""https://fonts.googleapis.com/css?display=swap&family=Oswald:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese"" rel=""stylesheet"" type=""text/css""><style type=""text/css"">@import url(https://fonts.googleapis.com/css?display=swap&family=Oswald:400,400i,700,700i|Roboto:400,400i,700,700i&subset=cyrillic,greek,latin-ext,vietnamese);</style></head><body style=""word-spacing:normal;background-color:#FFFFFF;""><div style=""background-color:#FFFFFF;"" lang=""und"" dir=""auto""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:10px 40px 5px 40px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:520px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px 0 20px 0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-behldb"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:171px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/dd5dae84-f292-41a4-ade5-718039b89d6c.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""171"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px 0 20px 0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-mwfchd"" style=""font-size:0px;padding:0 40px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #FFFFFF""><span style=""font-size: 40px""><span style=""font-family: Oswald, Arial, sans-serif"">Thank you for using our website</span></span></span></p></div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#AB0FA2"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#AB0FA2;background-color:#AB0FA2;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#AB0FA2;background-color:#AB0FA2;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:600px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-ayyirr"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:580px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/7e94eb91-2527-4738-a9a9-66bea0054a11.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""580"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-mlimage-vpxdmh gr-mlimage-pkjelf"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:collapse;border-spacing:0px;""><tbody><tr><td style=""width:580px;""><img alt="""" src=""https://us-ms.gr-cdn.com/getresponse-VEjc9/photos/49d7d924-fd06-46ce-80b8-42b08c95a79e.png"" style=""border:0;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;border-bottom:0 none #000000;border-radius:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"" width=""580"" height=""auto""></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""left"" class=""gr-mltext-dlxdgc gr-mltext-wxixmm"" style=""font-size:0px;padding:0 46px 0 36px;word-break:break-word;""><div style=""font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1.4;text-align:left;color:#000000;""><div style=""text-align: center""><p style=""font-family:Arial;font-size:14px;margin-top:0px;margin-bottom:0px;font-weight:normal;color:#000000;""><span style=""color: #353535""><span style=""font-size: 22px""><span style=""font-family: Oswald, Arial, sans-serif"">Please click the button below to confirm your mail</span></span></span></p></div></div></td></tr><tr><td align=""center"" style=""font-size:0px;padding:20px 40px 30px 40px;word-break:break-word;""><p style=""border-top:dashed 1px #7F7F7F;font-size:1px;margin:0px auto;width:100%;""></p><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""border-top:dashed 1px #7F7F7F;font-size:1px;margin:0px auto;width:500px;"" role=""presentation"" width=""500px"" ><tr><td style=""height:0;line-height:0;""> &nbsp;
</td></tr></table><![endif]--></td></tr><tr><td align=""center"" class=""gr-mlbutton-amvhba gr-mlbutton-xcuxvp link-id-fb30b5fea427"" style=""font-size:0px;padding:0;word-break:break-word;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-collapse:separate;line-height:100%;""><tbody><tr><td align=""center"" bgcolor=""transparent"" role=""presentation"" style=""border:none;border-bottom:2px solid #AB0FA2;border-left:2px solid #AB0FA2;border-radius:5px;border-right:2px solid #AB0FA2;border-top:2px solid #AB0FA2;cursor:auto;font-style:normal;mso-padding-alt:16px 28px;background:transparent;word-break:break-word;"" valign=""middle""><a href=""{link}"" style=""display:inline-block;background:transparent;color:#AB0FA2;font-family:Oswald, Arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;line-height:100%;margin:0;text-decoration:none;text-transform:none;padding:16px 28px;mso-padding-alt:0px;border-radius:5px;"" target=""_blank"">Click Me</a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:10px;line-height:10px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" bgcolor=""#FFFFFF"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background:#FFFFFF;background-color:#FFFFFF;width:100%;""><tbody><tr><td style=""border-bottom:10px solid #AB0FA2;border-left:10px solid #AB0FA2;border-right:10px solid #AB0FA2;border-top:0 none #000000;direction:ltr;font-size:0px;padding:0;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:580px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""font-size:0px;word-break:break-word;""><div style=""height:30px;line-height:30px;"">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:20px 5px 5px 5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" style=""font-size:0px;padding:5px;word-break:break-word;""><!--[if mso | IE]><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" ><tr><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-64f1dafd548a""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://facebook.com"" target=""_blank""><img alt=""facebook"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/facebook4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-e874522405d7""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://twitter.com"" target=""_blank""><img alt=""twitter"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/twitter4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-dc0e55f891f2""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://instagram.com"" target=""_blank""><img alt=""instagram"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/instagram4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td><td><![endif]--><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""float:none;display:inline-table;""><tbody><tr class=""link-id-459f6780665e""><td style=""padding:0 10px;vertical-align:middle;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""border-radius:0;width:30px;""><tbody><tr><td style=""font-size:0;height:30px;vertical-align:middle;width:30px;""><a href=""https://youtube.com"" target=""_blank""><img alt=""youtube"" height=""30"" src=""https://us-as.gr-cdn.com/images/common/templates/messages/v2/social/youtube4.png"" style=""border-radius:0;display:block;"" width=""30""></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" class="""" role=""presentation"" style=""width:600px;"" width=""600"" ><tr><td style=""line-height:0px;font-size:0px;mso-line-height-rule:exactly;""><![endif]--><div style=""margin:0px auto;max-width:600px;""><table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;""><tbody><tr><td style=""border-bottom:0 none #000000;border-left:0 none #000000;border-right:0 none #000000;border-top:0 none #000000;direction:ltr;font-size:0px;padding:5px;text-align:center;""><!--[if mso | IE]><table role=""presentation"" border=""0"" cellpadding=""0"" cellspacing=""0""><tr><td class="""" style=""vertical-align:top;width:590px;"" ><![endif]--><div class=""mj-column-per-100 mj-outlook-group-fix"" style=""font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td style=""background-color:transparent;border-bottom:none;border-left:none;border-right:none;border-top:none;vertical-align:top;padding:0;""><table border=""0"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" width=""100%""><tbody><tr><td align=""center"" class=""gr-footer-cahjoy gr-footer-pnfuxj"" style=""font-size:0px;padding:10px;word-break:break-word;""><div style=""font-family:Roboto, Arial, sans-serif;font-size:10px;font-style:normal;line-height:1;text-align:center;text-decoration:none;color:#818E9B;""><div>, 40C, 70000, Ho Chi Minh City, Công Hòa Xã Hội Chủ Nghĩa Việt Nam<br><br>Bạn có thể <a href=""https://app.getresponse.com/unsubscribe.html?x=a62b&m=E&mc=J5&s=E&u=VEjc9&z=EtqI9Wu&pt=unsubscribe"" target=""_blank"">hủy đăng ký</a> hoặc <a href=""https://app.getresponse.com/change_details.html?x=a62b&m=E&s=E&u=VEjc9&z=Eh6qRBL&pt=change_details"" target=""_blank"">thay đổi thông tin liên hệ</a> bất cứ lúc nào.</div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--><table align=""center"" style=""font-family: 'Roboto', Helvetica, sans-serif; font-weight: 400; letter-spacing: .018em; text-align: center; font-size: 10px;""><tr><td style=""padding-bottom: 20px""><br /><div style=""color: #939598;"">Cung cấp bởi:</div><a href=""https://app.getresponse.com/referral.html?x=a62b&c=Z2q4h&u=VEjc9&z=EQKoJ5a&""><img src=""https://app.getresponse.com/images/common/templates/badges/gr_logo_2.png"" alt=""GetResponse"" border=""0"" style=""display:block;"" width=""120"" height=""24""/></a></td></tr></table></div></body></html>";
        }
    }
}