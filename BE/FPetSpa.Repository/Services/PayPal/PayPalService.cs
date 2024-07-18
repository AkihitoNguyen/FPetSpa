using Azure.Core;
using FPetSpa.Repository.Model.PayPalModel;
using FPetSpa.Repository.Services.PayPal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PayPal.Api;
using System.Collections.Generic;
using System.Globalization;
using Twilio.TwiML.Voice;

public class PayPalService : IPayPalService
{
    private readonly IConfiguration _configuration;

    public PayPalService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private APIContext GetApiContext()
    {
        var clientId = _configuration["PayPal:ClientId"];
        var clientSecret = _configuration["PayPal:ClientSecret"];
        var config = new Dictionary<string, string>
        {
            { "mode", _configuration["PayPal:Mode"]! }
        };

        var accessToken = new OAuthTokenCredential(clientId, clientSecret, config).GetAccessToken();
        return new APIContext(accessToken) { Config = config };
    }

    public PayPalPaymentResponse CreatePayment(PayPalPaymentRequest request, string RETURN_URL, string CANCEL_URL)
    {
        var apiContext = GetApiContext();

        var payer = new Payer { payment_method = "paypal" };
        var redirectUrls = new RedirectUrls
        {
            cancel_url = CANCEL_URL,
            return_url = RETURN_URL
        };

        var amount = new Amount
        {
            currency = request.Currency,
            total = request.Amount.ToString("F2", CultureInfo.InvariantCulture)
        };

        var transactionList = new List<Transaction>
        {
            new Transaction
            {
                description = request.Description,
                invoice_number = new Random().Next(100000).ToString(),
                amount = amount
            }
        };

        var payment = new Payment
        {
            intent = "sale",
            payer = payer,
            transactions = transactionList,
            redirect_urls = redirectUrls
        };

        try
        {
            var createdPayment = payment.Create(apiContext);
            var approvalUrl = createdPayment.links.FirstOrDefault(x => x.rel == "approval_url")?.href;

            return new PayPalPaymentResponse
            {
                PaymentId = createdPayment.id,
                ApprovalUrl = approvalUrl
            };
        }
        catch (PayPal.PaymentsException ex)
        {
            // Log the exception or handle it appropriately
            throw new Exception($"Error creating PayPal payment: {ex.Message}");
        }
    }

    public Payment ExecutePayment(string paymentId, string payerId)
    {
        var apiContext = GetApiContext();

        var paymentExecution = new PaymentExecution { payer_id = payerId };
        var payment = new Payment { id = paymentId };

        var executedPayment = payment.Execute(apiContext, paymentExecution);

        return executedPayment;
    }

    public List<Object> transacitonList(int count = 10, string startId = null, decimal? minAmount = null, decimal? maxAmount = null, string startDate = null, string endDate = null, int? month = null, int? year = null)
    {
        var apiContext = GetApiContext();

        var transactionList = Payment.List(apiContext, count: count, startId: startId);

        var transactions = new List<object>();
        foreach (var payment in transactionList.payments)
        {
            var amount = decimal.Parse(payment.transactions[0].amount.total, CultureInfo.InvariantCulture);
            var currency = payment.transactions[0].amount.currency;
            var createTime = DateTime.Parse(payment.create_time);

            // Filter by amount
            if (minAmount.HasValue && amount < minAmount.Value) continue;
            if (maxAmount.HasValue && amount > maxAmount.Value) continue;

            // Filter by date range
            if (!string.IsNullOrEmpty(startDate) && !string.IsNullOrEmpty(endDate))
            {
                var startDateTime = DateTime.Parse(startDate);
                var endDateTime = DateTime.Parse(endDate);
                if (createTime < startDateTime || createTime > endDateTime) continue;
            }

            // Filter by month and year
            if (month.HasValue && createTime.Month != month.Value) continue;
            if (year.HasValue && createTime.Year != year.Value) continue;

            transactions.Add(new
            {
                Id = payment.id,
                State = payment.state,
                Amount = amount,
                Currency = currency,
                Description = payment.transactions[0].description,
                CreateTime = createTime
            });
        }
        return transactions;

    }

    public PayPalBalanceResponse GetTransactions(DateTime? startDate = null, DateTime? endDate = null)
    {
        try
        {
            var apiContext = GetApiContext();

            // Thiết lập thời gian mặc định là ngày hôm nay nếu không được cung cấp
            if (!startDate.HasValue)
            {
                startDate = DateTime.Today;
            }

            if (!endDate.HasValue)
            {
                endDate = DateTime.Today.AddDays(1).AddTicks(-1);
            }

            // Truy vấn lịch sử giao dịch
            var transactions = Payment.List(apiContext, count: 100, startId: null, startTime: startDate.Value.ToString("yyyy-MM-ddTHH:mm:ssZ"), endTime: endDate.Value.ToString("yyyy-MM-ddTHH:mm:ssZ"));

            // Tính toán tổng số tiền vào và ra
            decimal totalIn = 0;
            decimal totalOut = 0;

            foreach (var transaction in transactions.payments)
            {
                if (transaction.state == "approved")
                {
                    var amount = decimal.Parse(transaction.transactions[0].amount.total);
                    if (transaction.intent == "sale")
                    {
                        totalIn += amount;
                    }
                    else if (transaction.intent == "refund")
                    {
                        totalOut += amount;
                    }
                }
            }

            return new PayPalBalanceResponse
            {
                ToTalIn = totalIn,
                ToTalOut = totalOut
            };
        }
        catch (Exception ex)
        {
            // Log the error details
            return null;
        }
    }

}
