using FPetSpa.Repository.Model.PayPalModel;
using FPetSpa.Repository.Services.PayPal;
using Microsoft.Extensions.Configuration;
using PayPal.Api;
using System.Collections.Generic;
using System.Globalization;

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
            total = request.Amount.ToString("F2",CultureInfo.InvariantCulture)
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

}
