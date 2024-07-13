using FPetSpa.Repository.Data;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

public class BotService
{
    private readonly HttpClient _httpClient;
    private readonly string _botApiUrl;
    private readonly string _apiToken;

    public BotService(string botApiUrl, string apiToken)
    {
        _httpClient = new HttpClient();
        _botApiUrl = botApiUrl;
        _apiToken = apiToken;
    }

    public async Task<string> SendMessageToBotAsync(string message)
    {
        var requestUrl = $"{_botApiUrl}"; // Bao gồm bot_id và user_id trong query string

        // Tạo payload
        var payload = new
        {
            bot_id = "7391065050377338897",
            user_id = Guid.NewGuid().ToString(),
            role = "user",
            content = message,
            content_type = "text"
        };

        var jsonPayload = JsonConvert.SerializeObject(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        // Thêm API Token vào header
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiToken}");

        var response = await _httpClient.PostAsync(requestUrl, content);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            // Xử lý lỗi
            throw new HttpRequestException($"Error: {response.StatusCode}");
        }
    }

    public async Task<string> RetrieveChatInformationAsync()
    {
        var requestUrl = $"{_botApiUrl}/retrieve?chat_id={"7355746794447798273/bot/7391065050377338897"}&conversation_id={Guid.NewGuid()}"; // Bao gồm bot_id và user_id trong query string

        // Thêm API Token vào header
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiToken}");

        var response = await _httpClient.GetAsync(requestUrl);

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            // Xử lý lỗi
            throw new HttpRequestException($"Error: {response.StatusCode}");
        }
    }
}
