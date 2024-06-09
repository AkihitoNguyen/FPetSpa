﻿using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model.VnPayModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace FPetSpa.Repository.Services.VnPay
{
    public class VnPayService : IVnPayService
    {
        private IConfiguration _configuration;

        public VnPayService(IConfiguration config)
        {
            _configuration = config;
        }

        public string CreatePaymentURl(HttpContext httpContext, VnPayRequestModel vnPayRequestModel)
        {
            var tick = DateTime.Now.Ticks.ToString();

            VnPayLibrary vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", _configuration["VnPay:Version"]!);
            vnpay.AddRequestData("vnp_Command", _configuration["VnPay:Command"]!);
            vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]!);
            vnpay.AddRequestData("vnp_Amount", (vnPayRequestModel.Amount * 100).ToString()); //Số tiền thanh toán. Số tiền không 
            //mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND
            //(một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần(khử phần thập phân), sau đó gửi sang VNPAY
            //là: 10000000

            vnpay.AddRequestData("vnp_CreateDate", vnPayRequestModel.CreatedDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _configuration["VnPay:CurrCode"]!);
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(httpContext));
            vnpay.AddRequestData("vnp_Locale", _configuration["VnPay:Locale"]!);

            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toán cho đơn hàng:" + vnPayRequestModel.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
            vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VnPay:PaymentBackReturnUrl"]!);

            vnpay.AddRequestData("vnp_TxnRef", tick); // Mã tham chiếu của giao dịch tại hệ 
            //thống của merchant.Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.Không được
            //    trùng lặp trong ngày

            var paymentUrl = vnpay.CreateRequestUrl(_configuration["VnPay:BaseUrl"]!, _configuration["VnPay:HashSecret"]!);
       
            return paymentUrl;
        }

        public VnPayResponseModel PayymentExecute(IQueryCollection collection)
        {
            var vnpay = new VnPayLibrary();
            foreach (var(key, value) in collection)
            {
                if(!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_transactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collection.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _configuration["VnPay:HashSecret"]);
            if (!checkSignature)
            {
                return new VnPayResponseModel
                {
                    Success = false,
                };
            }
            return new VnPayResponseModel { 
              Success = true, PaymentMethod = "VnPay",
              OrderDescription = vnp_OrderInfo,
              OrderId = vnp_orderId.ToString(),
              TransactionId = vnp_transactionId.ToString(),
              Token = vnp_SecureHash.ToString(),
              VnPayResponseCode = vnp_ResponseCode.ToString(),
            };

            
        }
    }
}
