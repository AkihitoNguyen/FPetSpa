using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Helper
{
    public class ConvertUSDtoVND
    {
        public async Task<decimal> GetExchangeRateAsync()
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://openexchangerates.org");
                var response = await client.GetAsync("/api/latest.json?app_id=5ac70a50378a452788c2c6b58b692fd8&symbols=VND,USD");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<ExchangeRateResponse>(json);

                decimal usdToVndRate = data.Rates["VND"] / data.Rates["USD"];
                return usdToVndRate;
            }
        }

        public class ExchangeRateResponse
        {
            public Dictionary<string, decimal> Rates { get; set; }
        }

    }
}
