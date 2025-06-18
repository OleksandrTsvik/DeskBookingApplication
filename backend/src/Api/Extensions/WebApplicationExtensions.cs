using Infrastructure.Database;

namespace Api.Extensions;

public static class WebApplicationExtensions
{
    public static void UseApiCors(this WebApplication app)
    {
        app.UseCors("CorsPolicy");
    }

    public static async Task ConfigureDatabaseAsync(this WebApplication app)
    {
        await using AsyncServiceScope scope = app.Services.CreateAsyncScope();

        await scope.ServiceProvider.GetRequiredService<DatabaseInitializer>().ExecuteAsync();
    }
}
