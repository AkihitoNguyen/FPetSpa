using System.Net.Http.Headers;
using System.Net.Http.Json;
using FPetSpa.Repository.Services.PayPal;
using Microsoft.Extensions.Configuration;

public class PayPalService : IPayPalService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public PayPalService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GetAccessTokenAsync()
    {
        var clientId = _configuration["PayPal:ClientId"];
        var clientSecret = _configuration["PayPal:ClientSecret"];
        var authToken = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authToken);

        var response = await _httpClient.PostAsync("https://api.sandbox.paypal.com/v1/oauth2/token", new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        }));

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<PayPalTokenResponse>();
        return payload.access_token;
    }

    public async Task<PayPalPaymentResponse> CreatePaymentAsync(PaymentRequest paymentRequest)
    {
        var accessToken = await GetAccessTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.PostAsJsonAsync("https://api.sandbox.paypal.com/v1/payments/payment", paymentRequest);
        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<PayPalPaymentResponse>();
    }

    public async Task<PayPalPaymentResponse> ExecutePaymentAsync(string paymentId, string payerId)
    {
        var accessToken = await GetAccessTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var executePaymentUrl = $"https://api.sandbox.paypal.com/v1/payments/payment/{paymentId}/execute";
        var response = await _httpClient.PostAsJsonAsync(executePaymentUrl, new { payer_id = payerId });

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<PayPalPaymentResponse>();
    }
}

public class PayPalTokenResponse
{
    public string access_token { get; set; }
}

public class PayPalPaymentResponse
{
    public string id { get; set; }
    public string state { get; set; }
    public PayPalLink[] links { get; set; }
}

public class PayPalLink
{
    public string href { get; set; }
    public string rel { get; set; }
    public string method { get; set; }
}

public class PaymentRequest
{
    public string intent { get; set; }
    public Payer payer { get; set; }
    public TransactionPayPal[] transactions { get; set; }
    public RedirectUrls redirect_urls { get; set; }
}

public class Payer
{
    public string payment_method { get; set; }
}

public class TransactionPayPal
{
    public Amount amount { get; set; }
    public string description { get; set; }
    public ItemList item_list { get; set; }
}

public class Amount
{
    public string total { get; set; }
    public string currency { get; set; }
}

public class ItemList
{
    public Item[] items { get; set; }
}

public class Item
{
    public string name { get; set; }
    public string currency { get; set; }
    public string price { get; set; }
    public string quantity { get; set; }
}

public class RedirectUrls
{
    public string return_url { get; set; }
    public string cancel_url { get; set; }
}
