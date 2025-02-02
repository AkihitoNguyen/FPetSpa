﻿using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Model.VnPayModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using static QRCoder.PayloadGenerator.ShadowSocksConfig;

namespace FPetSpa.Repository.Services.VnPay
{
    public class VnPayService : IVnPayService
    {
        private IConfiguration _configuration;

        public VnPayService(IConfiguration config)
        {
            _configuration = config;
        }

        public string CreatePaymentURl(VnPayRequestModel vnPayRequestModel, HttpContext context)
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
            vnpay.AddRequestData("vnp_Locale", _configuration["VnPay:Locale"]!);
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_OrderInfo", "Đơn hàng:" + vnPayRequestModel.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
                                                            // vnpay.AddRequestData("vnp_ExpireDate, ", vnPayRequestModel.ExpiredDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_ReturnUrl", vnPayRequestModel.ResponseUrl);

            vnpay.AddRequestData("vnp_TxnRef", vnPayRequestModel.OrderId); // Mã tham chiếu của giao dịch tại hệ 
            //thống của merchant.Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.Không được
            //    trùng lặp trong ngày


            var paymentUrl = vnpay.CreateRequestUrl(_configuration["VnPay:Url"]!, _configuration["VnPay:HashSecret"]!);

            return paymentUrl;
        }

        public VnPayResponseModel PayymentExecute(IQueryCollection collection)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_orderId = (vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_transactionId = (vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collection.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _configuration["VnPay:HashSecret"]!);
            if (!checkSignature)
            {
                return new VnPayResponseModel
                {
                    Success = false,
                };
            }
            return new VnPayResponseModel
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_orderId.ToString(),
                TransactionId = vnp_transactionId.ToString(),
                Token = vnp_SecureHash.ToString(),
                VnPayResponseCode = vnp_ResponseCode.ToString(),
            };
        }
        public async Task<VnPayBalanceResponse> GetVnPayBalanceAsync(DateTime? startDate, DateTime? endDate, HttpContext context)
        {
            VnPayLibrary vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", _configuration["VnPay:Version"]!);
            vnpay.AddRequestData("vnp_Command", "querydr");
            vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]!);
            vnpay.AddRequestData("vnp_TxnRef", Guid.NewGuid().ToString());
            vnpay.AddRequestData("vnp_OrderInfo", "Query balance");
            vnpay.AddRequestData("vnp_TransDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));

            var effectiveStartDate = startDate ?? DateTime.Today;
            var effectiveEndDate = endDate ?? DateTime.Today;

            vnpay.AddRequestData("vnp_BeginDate", effectiveStartDate.ToString("yyyyMMdd"));
            vnpay.AddRequestData("vnp_EndDate", effectiveEndDate.ToString("yyyyMMdd"));

            var baseUrl = _configuration["VnPay:BalanceApiUrl"];
            var requestUrl = vnpay.CreateRequestUrl(baseUrl!, _configuration["VnPay:HashSecret"]!);

            // Ghi lại URL để kiểm tra
            Console.WriteLine("Request URL: " + requestUrl);

            using (var httpClient = new HttpClient())
            {
                // Tạo nội dung POST
                var content = new FormUrlEncodedContent(vnpay.RequestData);

                var response = await httpClient.PostAsync(requestUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                Console.WriteLine("Response from VNPAY: " + responseString);

                try
                {
                    var vnPayBalanceResponse = JsonConvert.DeserializeObject<VnPayBalanceResponse>(responseString);

                    if (vnPayBalanceResponse.Status == 0)
                    {
                        return vnPayBalanceResponse;
                    }
                    else
                    {
                        throw new Exception($"Error retrieving balance: {vnPayBalanceResponse.Message}");
                    }
                }
                catch (JsonReaderException)
                {
                    throw new Exception($"Invalid response format: {responseString}");
                }
            }
        }
    }
}
