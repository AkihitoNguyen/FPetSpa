using FPetSpa.Repository.Model.GoogleMapModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FPetSpa.Repository.Services
{
    public class GoogleMapService
    {
        private readonly System.Net.Http.HttpClient _httpClient;
        public double ratePerKm { get; set; } = 0.2;
        public GoogleMapService(IConfiguration configuration)
        {
            _httpClient = new System.Net.Http.HttpClient();

        }

        public async Task<Object> CalculateShippingCost(string origin, string destination)
        {
            // Replace with your OpenRouteService API key
            string apiKey = "5b3ce3597851110001cf6248163b441c5d044bfca6894fdb9994dd1a";

            // URL encode the addresses
            string encodedOrigin = Uri.EscapeDataString(origin);
            string encodedDestination = Uri.EscapeDataString(destination);

            // Get coordinates for origin
            string originUrl = $"https://api.openrouteservice.org/geocode/search?api_key={apiKey}&text={encodedOrigin}";

            HttpResponseMessage originResponse = await _httpClient.GetAsync(originUrl);
            if (!originResponse.IsSuccessStatusCode)
            {
                string originError = await originResponse.Content.ReadAsStringAsync();
                return null!;
            }

            string originData = await originResponse.Content.ReadAsStringAsync();
            JObject originJson = JObject.Parse(originData);
            var originCoordinates = originJson["features"]?[0]?["geometry"]?["coordinates"];
            if (originCoordinates == null)
            {
                return null;
            }
            string originLon = originCoordinates[0].ToString().Replace(',', '.');
            string originLat = originCoordinates[1].ToString().Replace(',', '.');

            // Get coordinates for destination
            string destinationUrl = $"https://api.openrouteservice.org/geocode/search?api_key={apiKey}&text={encodedDestination}";

            HttpResponseMessage destinationResponse = await _httpClient.GetAsync(destinationUrl);
            if (!destinationResponse.IsSuccessStatusCode)
            {
                string destinationError = await destinationResponse.Content.ReadAsStringAsync();
                return null!;
            }

            string destinationData = await destinationResponse.Content.ReadAsStringAsync();
            JObject destinationJson = JObject.Parse(destinationData);
            var destinationCoordinates = destinationJson["features"]?[0]?["geometry"]?["coordinates"];
            if (destinationCoordinates == null)
            {
                return null!;
            }
            string destinationLon = destinationCoordinates[0].ToString().Replace(',', '.');
            string destinationLat = destinationCoordinates[1].ToString().Replace(',', '.');

            // Get distance between origin and destination
            string routeUrl = $"https://api.openrouteservice.org/v2/directions/driving-car?api_key={apiKey}&start={originLon},{originLat}&end={destinationLon},{destinationLat}";

            HttpResponseMessage routeResponse = await _httpClient.GetAsync(routeUrl);
            if (!routeResponse.IsSuccessStatusCode)
            {
                string routeError = await routeResponse.Content.ReadAsStringAsync();
                return null!;
            }


            string routeData = await routeResponse.Content.ReadAsStringAsync();


            JObject routeJson = JObject.Parse(routeData);
            var features = routeJson["features"]?[0]?["properties"]?["segments"]?[0];
            if (features == null)
            {
                return null!;
            }

            var distanceInMeters = double.Parse(features["distance"].ToString());
            double distanceInKm = distanceInMeters / 1000;

            // Calculate shipping cost
            double shippingCost = distanceInKm * ratePerKm;

            return (new { distance = $"{distanceInKm} km", cost = shippingCost });
        }
    }    }
