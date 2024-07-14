using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;


namespace FPetSpa.Controllers
{
    [Route("api/BotController")]
    [ApiController]
    public class BotController : ControllerBase
    {
        private readonly BotService _botService;

        public BotController(BotService botService)
        {
            _botService = botService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] string message)
        {
            var response = await _botService.SendMessageToBotAsync(message);
            return Ok(response);
        }
        [HttpGet("retrieve-chat")]
        public async Task<IActionResult> RetrieveChatInformation()
        {
            var response = await _botService.RetrieveChatInformationAsync();
            return Ok(response);
        }
    }
}
