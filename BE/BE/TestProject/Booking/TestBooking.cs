using Amazon.S3.Model;
using FPetSpa.Controllers;
using FPetSpa.Repository;
using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Repository;
using FPetSpa.Repository.Services;
using FPetSpa.Repository.Services.PayPal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Assert = Xunit.Assert;

namespace TestProject.Booking
{

    public class TestBooking
    {

        [Fact]
        public async Task GetAll_ValidAllBooking_ReturnOk()
        {
            var orderRepo = new Mock<GenericRepository<Order>>(new Mock<FpetSpaContext>().Object);
            var UnitOfWorkMock = new Mock<IUnitOfWork>();
            var IpayPalMock = new Mock<IPayPalService>();
            var IvnPayMock = new Mock<IVnPayService>();

            IEnumerable<Order> orderList = new List<Order>();

            orderRepo.Setup(o => o.GetAllAsync()).ReturnsAsync(orderList);

            UnitOfWorkMock.Setup(u => u.OrderGenericRepo).Returns(orderRepo.Object);

            var controller = new OrderController(UnitOfWorkMock.Object, IvnPayMock.Object, IpayPalMock.Object);

            var result = await controller.getAllOrder();

            var OkResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Order>>(OkResult.Value);
            Assert.Equal(orderList, returnValue);
        }

        // public OrderRepository(FpetSpaContext context, UserManager<ApplicationUser> userManager, SendMailServices sendMailServices, IVnPayService payService, IHttpContextAccessor httpContext, IPayPalService payPalService)


        [Fact]
        public async Task BookingProduct_ValidBooking_ReturnTrue()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            var userManagerMock = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
            var IOptionMail = new Mock<IOptions<MailSettingsModel>>();
            var sendService = new Mock<SendMailServices>(IOptionMail.Object);
            var IHttp = new Mock<IHttpContextAccessor>();
            var UnitOfWorkMock = new Mock<IUnitOfWork>();
            var IpayPalMock = new Mock<IPayPalService>();
            var IvnPayMock = new Mock<IVnPayService>();
            var orderRepo = new Mock<OrderRepository>(new Mock<FpetSpaContext>().Object, userManagerMock.Object, sendService.Object, IvnPayMock.Object, IHttp.Object, IpayPalMock.Object);

            var Order = new Mock<Order>();

            orderRepo.Setup(o => o.AfterCheckOutProduct("")).ReturnsAsync(true);

            UnitOfWorkMock.Setup(u => u.OrderRepository).Returns(orderRepo.Object);

            //  var controller = new OrderController(UnitOfWorkMock.Object, IvnPayMock.Object, IpayPalMock.Object);


            var result = await UnitOfWorkMock.Object.OrderRepository.AfterCheckOutProduct("");

            Assert.True(result);
        }


        [Fact]
        public async Task BookingProduct_ValidBooking_ReturnFalse()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            var userManagerMock = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
            var IOptionMail = new Mock<IOptions<MailSettingsModel>>();
            var sendService = new Mock<SendMailServices>(IOptionMail.Object);
            var IHttp = new Mock<IHttpContextAccessor>();
            var UnitOfWorkMock = new Mock<IUnitOfWork>();
            var IpayPalMock = new Mock<IPayPalService>();
            var IvnPayMock = new Mock<IVnPayService>();
            var orderRepo = new Mock<OrderRepository>(new Mock<FpetSpaContext>().Object, userManagerMock.Object, sendService.Object, IvnPayMock.Object, IHttp.Object, IpayPalMock.Object);

            var Order = new Mock<Order>();

            orderRepo.Setup(o => o.AfterCheckOutProduct("")).ReturnsAsync(false);

            UnitOfWorkMock.Setup(u => u.OrderRepository).Returns(orderRepo.Object);

            //  var controller = new OrderController(UnitOfWorkMock.Object, IvnPayMock.Object, IpayPalMock.Object);


            var result = await UnitOfWorkMock.Object.OrderRepository.AfterCheckOutProduct("");

            Assert.False(result);
        }

        [Fact]
        public async Task BookingServices_ValidBooking_ReturnTrue()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            var userManagerMock = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
            var IOptionMail = new Mock<IOptions<MailSettingsModel>>();
            var sendService = new Mock<SendMailServices>(IOptionMail.Object);
            var IHttp = new Mock<IHttpContextAccessor>();
            var UnitOfWorkMock = new Mock<IUnitOfWork>();
            var IpayPalMock = new Mock<IPayPalService>();
            var IvnPayMock = new Mock<IVnPayService>();
            var orderRepo = new Mock<OrderRepository>(new Mock<FpetSpaContext>().Object, userManagerMock.Object, sendService.Object, IvnPayMock.Object, IHttp.Object, IpayPalMock.Object);

            var Order = new Mock<Order>();

            var servicesOrderDetail = new Mock<ServiceOrderDetail>();

            orderRepo.Setup(o => o.AfterCheckOutService("")).ReturnsAsync(true);

            UnitOfWorkMock.Setup(u => u.OrderRepository).Returns(orderRepo.Object);

            //  var controller = new OrderController(UnitOfWorkMock.Object, IvnPayMock.Object, IpayPalMock.Object);


            var result = await UnitOfWorkMock.Object.OrderRepository.AfterCheckOutService("");

            Assert.True(result);
        }

        [Fact]
        public async Task BookingServices_ValidBooking_ReturnFalse()
        {
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            var userManagerMock = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
            var IOptionMail = new Mock<IOptions<MailSettingsModel>>();
            var sendService = new Mock<SendMailServices>(IOptionMail.Object);
            var IHttp = new Mock<IHttpContextAccessor>();
            var UnitOfWorkMock = new Mock<IUnitOfWork>();
            var IpayPalMock = new Mock<IPayPalService>();
            var IvnPayMock = new Mock<IVnPayService>();
            var orderRepo = new Mock<OrderRepository>(new Mock<FpetSpaContext>().Object, userManagerMock.Object, sendService.Object, IvnPayMock.Object, IHttp.Object, IpayPalMock.Object);

            var Order = new Mock<Order>();

            var servicesOrderDetail = new Mock<ServiceOrderDetail>();

            orderRepo.Setup(o => o.AfterCheckOutService("")).ReturnsAsync(false);

            UnitOfWorkMock.Setup(u => u.OrderRepository).Returns(orderRepo.Object);

            //  var controller = new OrderController(UnitOfWorkMock.Object, IvnPayMock.Object, IpayPalMock.Object);


            var result = await UnitOfWorkMock.Object.OrderRepository.AfterCheckOutService("");

            Assert.False(result);
        }
    }
}


