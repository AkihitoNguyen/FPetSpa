using FPetSpa.Controllers;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Org.BouncyCastle.Asn1.X509.SigI;
using System.Security.Claims;
using Xunit;
using Assert = Xunit.Assert;
namespace ProjectTest.Test
{
    public class TestAccount
    {

        [Fact]
        public async Task Login_ValidCredentials_ReturnTrue()
        {
            var mockRepo = new Mock<IAccountRepository>();
            var mocUnit = new Mock<IUnitOfWork>();

            var result = new TokenModel
            {
                AccessToken = "phihungnguyen03022003@gmail.com",
                FullName = "phihungnguyen03022003@gmail.com",
                RefreshToken = ""
                //  PasswordHash = "AQAAAAIAAYagAAAAEGgMxKUvrPCOEsOh1MrZUgPsttVXb4cZMO1ioJgm+30MsPKHTBfRoloPaHOYElf25w=="
            };

            var signInModel = new SignInModel
            {
                Gmail = "phihungnguyen03022003@gmail.com",
                Password = "Hunghau589@"
            };


            mockRepo.Setup(a => a.SignInAsync(signInModel)).ReturnsAsync(result);
            mocUnit.Setup(uow => uow._IaccountRepository).Returns(mockRepo.Object);


            var controller = new AccountsController(mocUnit.Object);

            var check = await controller.SignIn(signInModel);



            Assert.IsType<OkObjectResult>(check);

        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnFalse()
        {
            var mockRepo = new Mock<IAccountRepository>();
            var mocUnit = new Mock<IUnitOfWork>();

            var signInModel = new SignInModel
            {
                Gmail = "phihungnguyen03022003@gmail.com",
                Password = "Hunghau589@"
            };

            mocUnit.Setup(uow => uow._IaccountRepository).Returns(mockRepo.Object);

            mockRepo.Setup(a => a.SignInAsync(signInModel)).ReturnsAsync((TokenModel)null!);

            var controller = new AccountsController(mocUnit.Object);

            var check = await controller.SignIn(signInModel);



            Assert.IsType<UnauthorizedResult>(check);
                
        }

        [Fact]
        public async Task Register_ValidCredentitals_ReturnTrue()
        {
            var mockRepo = new Mock<IAccountRepository>();
            var mocUnit = new Mock<IUnitOfWork>();

            var signUpModel = new SignUpModel
            {
                Gmail = "phihungnguyen03022003@gmail.com",
                Password = "Hunghau589@",
                FullName = "DemoName",
                ConfirmPassword = "Hunghau589@"
            };

            mocUnit.Setup(uow => uow._IaccountRepository).Returns(mockRepo.Object);

            mockRepo.Setup(a => a.SignUpAsync(signUpModel)).ReturnsAsync(IdentityResult.Success);

            var controller = new AccountsController(mocUnit.Object);

            var check = await controller.SignUp(signUpModel);


            Assert.IsType<OkObjectResult>(check);
        }

        [Fact]
        public async Task Register_ValidCredentitals_ReturnFalse()
        {
            var mockRepo = new Mock<IAccountRepository>();
            var mocUnit = new Mock<IUnitOfWork>();

            var signUpModel = new SignUpModel
            {
                Gmail = "phihungnguyen03022003@gmail.com",
                Password = "Hunghau589@",
                FullName = "DemoName",
                ConfirmPassword = "Hunghau589@"
            };

            mocUnit.Setup(uow => uow._IaccountRepository).Returns(mockRepo.Object);

            mockRepo.Setup(a => a.SignUpAsync(signUpModel)).ReturnsAsync(IdentityResult.Failed());

            var controller = new AccountsController(mocUnit.Object);

            var check = await controller.SignUp(signUpModel);


            Assert.IsType<StatusCodeResult>(check);
        }

        [Fact]
        public async Task LogOut_ValidCredentitals_ReturnTrue()
        {
            var mockRepo = new Mock<IAccountRepository>();
            var mocUnit = new Mock<IUnitOfWork>();

            var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
              {
            new Claim(ClaimTypes.Name, "testuser")
              }));

            mocUnit.Setup(uow => uow._IaccountRepository).Returns(mockRepo.Object);

            mockRepo.Setup(a => a.logOut(userClaim)).ReturnsAsync(true);

            var controller = new AccountsController(mocUnit.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = userClaim
                    }
                }
            };

            var check = await controller.logOut();

            Assert.IsType<OkObjectResult>(check);
        }

        [Fact]
        public async Task LogOut_ValidCredentitals_ReturnFalse()
        {
            var mockRepo = new Mock<IAccountRepository>();
            var mocUnit = new Mock<IUnitOfWork>();

            var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
              {
            new Claim(ClaimTypes.Name, "testuser")
              }));

            mocUnit.Setup(uow => uow._IaccountRepository).Returns(mockRepo.Object);

            mockRepo.Setup(a => a.logOut(userClaim)).ReturnsAsync(false);

            var controller = new AccountsController(mocUnit.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = userClaim
                    }
                }
            };

            var check = await controller.logOut();

            Assert.IsType<UnauthorizedResult>(check);
        }

    }


}
