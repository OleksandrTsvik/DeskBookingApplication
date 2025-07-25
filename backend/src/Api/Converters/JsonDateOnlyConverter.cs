using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Converters;

public class JsonDateOnlyConverter : JsonConverter<DateOnly>
{
    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TryGetDateTime(out DateTime dateTime))
        {
            return DateOnly.FromDateTime(dateTime);
        }

        return default;
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("yyyy-MM-dd"));
    }
}
