using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Database;

public sealed class DatabaseInitializer
{
    private readonly ILogger<DatabaseInitializer> _logger;
    private readonly ApplicationDbContext _dbContext;

    public DatabaseInitializer(ILogger<DatabaseInitializer> logger, ApplicationDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting database initialization.");

            await ApplyMigrationsAsync(cancellationToken);

            _logger.LogInformation("Database initialization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing the database.");
        }
    }

    private async Task ApplyMigrationsAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Applying database migrations.");

        await _dbContext.Database.MigrateAsync(cancellationToken);

        _logger.LogInformation("Database migrations applied successfully.");
    }
}
