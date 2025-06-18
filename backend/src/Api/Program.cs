using Api.Endpoints;
using Api.Extensions;
using Api.Options;
using Infrastructure;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services
    .AddExceptionHandler()
    .AddOptionsWithValidation()
    .AddApiCors(builder.Configuration)
    .AddEndpoints()
    .AddInfrastructure(builder.Configuration)
    .AddFluentValidation();

WebApplication app = builder.Build();

await app.ConfigureDatabaseAsync();

app.UseApiCors();

RouteGroupBuilder apiRouteGroupBuilder = app.MapGroup("api");

app.MapEndpoints(apiRouteGroupBuilder);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseExceptionHandler();

app.Run();
