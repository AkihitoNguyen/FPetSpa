using FPetSpa.Repository.Services;
using Microsoft.AspNetCore.Mvc;

namespace FPetSpa.Controllers
{
    [ApiController]
    [Route("ShipCost")]
    public class GoogleMapController : Controller
    {
        private readonly GoogleMapService _googleMapService;

        public GoogleMapController(GoogleMapService googleMapService)
        {
            _googleMapService = googleMapService;
        }

        [HttpGet("GetCostShippingGoogleMap")]
        public async Task<IActionResult> check(string ToDistrict)
        {
            string origin = "1c Đường Số 22, Phước Long B, Quận 9, Hồ Chí Minh, Việt Nam";
            var result = await _googleMapService.CalculateShippingCost(origin, ToDistrict);
            return Ok(result);

            }
    }
}
