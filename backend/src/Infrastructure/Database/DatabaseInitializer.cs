using Domain.Workspaces;
using Infrastructure.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Database;

public sealed class DatabaseInitializer
{
    private readonly ILogger<DatabaseInitializer> _logger;
    private readonly ApplicationDbContext _dbContext;
    private readonly SeedOptions _seedOptions;

    public DatabaseInitializer(
        ILogger<DatabaseInitializer> logger,
        ApplicationDbContext dbContext,
        IOptions<SeedOptions> seedOptions)
    {
        _logger = logger;
        _dbContext = dbContext;
        _seedOptions = seedOptions.Value;
    }

    public async Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting database initialization.");

            await ApplyMigrationsAsync(cancellationToken);
            await SeedInitialDataAsync(cancellationToken);

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

    private async Task SeedInitialDataAsync(CancellationToken cancellationToken)
    {
        await SeedWorkspacesAsync(cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedWorkspacesAsync(CancellationToken cancellationToken)
    {
        bool hasAnyWorkspaces = await _dbContext.Workspaces.AnyAsync(cancellationToken);

        if (hasAnyWorkspaces)
        {
            return;
        }

        var workspaces = _seedOptions.Workspaces
            .Select(workspaceSeed => CreateWorkspace(workspaceSeed))
            .ToList();

        _dbContext.Workspaces.AddRange(workspaces);
    }

    private static Workspace CreateWorkspace(WorkspaceSeed workspaceSeed)
    {
        List<Desk> desks = CreateWorkspaceDesks(workspaceSeed.DeskCount);
        List<Room> rooms = CreateWorkspaceRooms(workspaceSeed.RoomConfigurations ?? []);

        var workspace = new Workspace
        {
            Name = workspaceSeed.Name,
            Description = workspaceSeed.Description,
            Desks = desks,
            Rooms = rooms,
        };

        return workspace;
    }

    private static List<Desk> CreateWorkspaceDesks(int count) =>
        Enumerable
            .Range(0, count)
            .Select(_ => new Desk())
            .ToList();

    private static List<Room> CreateWorkspaceRooms(RoomConfigurationSeed[] roomConfigurations)
    {
        var rooms = new List<Room>();

        foreach (RoomConfigurationSeed roomConfiguration in roomConfigurations)
        {
            rooms.AddRange(Enumerable
                .Repeat(roomConfiguration.Capacity, roomConfiguration.Count)
                .Select(capacity => new Room
                {
                    Capacity = capacity,
                }));
        }

        return rooms;
    }
}
