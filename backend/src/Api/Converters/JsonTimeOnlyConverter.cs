using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Converters;

public class JsonTimeOnlyConverter : JsonConverter<TimeOnly>
{
    public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TryGetDateTime(out DateTime dateTime))
        {
            return TimeOnly.FromDateTime(dateTime);
        }

        return default;
    }

    public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("HH:mm:ss.fff"));
    }
}
