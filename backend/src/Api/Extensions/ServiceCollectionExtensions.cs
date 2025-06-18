using System.Reflection;
using Api.Middleware;
using Api.Options.Models;
using FluentValidation;

namespace Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddExceptionHandler(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        return services;
    }

    public static IServiceCollection AddApiCors(
        this IServiceCollection services,
        ConfigurationManager configuration)
    {
        CorsOptions? corsOptions = configuration
            .GetSection(CorsOptions.ConfigurationSectionName)
            .Get<CorsOptions>();

        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .WithOrigins(corsOptions?.Origins ?? [])
                    .AllowCredentials()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        return services;
    }

    public static IServiceCollection AddFluentValidation(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(AssemblyReference.Assembly);

        return services;
    }

    public static IServiceCollection AddTransientEndsWith(
        this IServiceCollection services,
        string endsWith,
        Assembly assembly)
    {
        return services.AddEndsWith(endsWith, ServiceLifetime.Transient, assembly);
    }

    public static IServiceCollection AddScopedEndsWith(
        this IServiceCollection services,
        string endsWith,
        Assembly assembly)
    {
        return services.AddEndsWith(endsWith, ServiceLifetime.Scoped, assembly);
    }

    public static IServiceCollection AddSingletonEndsWith(
        this IServiceCollection services,
        string endsWith,
        Assembly assembly)
    {
        return services.AddEndsWith(endsWith, ServiceLifetime.Singleton, assembly);
    }

    private static IServiceCollection AddEndsWith(
        this IServiceCollection services,
        string endsWith,
        ServiceLifetime lifetime,
        Assembly assembly)
    {
        var classes = assembly
            .GetTypes()
            .Where(type => type.IsClass && !type.IsAbstract && type.Name.EndsWith(endsWith))
            .ToList();

        foreach (Type @class in classes)
        {
            Type? @interface = @class.GetInterfaces().FirstOrDefault(type => type.Name.EndsWith(endsWith));

            if (@interface is not null)
            {
                services.Add(new ServiceDescriptor(@interface, @class, lifetime));
            }
        }

        return services;
    }
}
