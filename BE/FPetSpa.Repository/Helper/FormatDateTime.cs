using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace FPetSpa.Repository.Helper
{

    public class FormatDateTime : JsonConverter<DateTime>
    {
        private const string Format = "dd/MM/yyyy HH:mm:ss";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.ParseExact(reader.GetString(), Format, CultureInfo.InvariantCulture);

    public class FormatDateTime : JsonConverter<DateTime>
    {
        private const string Format = "yyyy-MM-ddTHH:mm:ss.fffZ";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var dateString = reader.GetString();

            if (DateTime.TryParseExact(dateString, Format, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out DateTime parsedDate))
            {
                return parsedDate;
            }
            else if (DateTime.TryParse(dateString, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out parsedDate))
            {
                return parsedDate;
            }
            else
            {
                throw new JsonException($"Unable to parse '{dateString}' as a valid DateTime.");
            }
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(Format, CultureInfo.InvariantCulture));
        }
    }
}
