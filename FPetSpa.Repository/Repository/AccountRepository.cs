using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace FPetSpa.Repository.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<IdentityRole> roleManager;

        public AccountRepository(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        { 
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
        }
        public async Task<TokenModel> SignInAsync(SignInModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Gmail);
            var passwordValid = await userManager.CheckPasswordAsync(user! , model.Password);
            if(user == null ||  !passwordValid) 
            {
                return null;
            }

            //var result = await signInManager.PasswordSignInAsync(model.Gmail, model.Password, false, false);
            //if(!result.Succeeded)
            //{
            //    return String.Empty;
            //}
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, model.Gmail),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach(var role in userRoles) 
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
            //userManager.SetAuthenticationTokenAsync(user, accessToken);

            return new TokenModel
            {
                FullName = user.FullName,
                AccessToken = accessToken,
                RefreshToken = GenerateRefeshToken()
            };
        }


        public async Task<IdentityResult> SignUpAsync(SignUpModel model)
        {
            var user = new ApplicationUser
            {
                FullName = model.FullName,
                Gmail = model.Gmail,
                UserName = model.Gmail,
                Email = model.Gmail
            };
            var resutl = await userManager.CreateAsync(user, model.Password);
        
            if(resutl.Succeeded) 
            {
                //Kiểm tra role đã có chưa?
                if(!await roleManager.RoleExistsAsync(Role.Customer))
                {
                    await roleManager.CreateAsync(new IdentityRole
                        (Role.Customer));
                }

                await userManager.AddToRoleAsync(user, Role.Customer);
            }
            return resutl;
        }

        public async Task<string> SignInWithGoogle(string gmail, string name)
        {
             var user = await userManager.FindByEmailAsync(gmail);
            if(user == null) 
            {
                user = new ApplicationUser
                {
                    Gmail = gmail,
                    UserName = gmail,
                    FullName = name,
                    Email = gmail
                };
                var result = await userManager.CreateAsync(user);

                if(result.Succeeded)
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
            return new JwtSecurityTokenHandler().WriteToken(token);
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
    }
}
