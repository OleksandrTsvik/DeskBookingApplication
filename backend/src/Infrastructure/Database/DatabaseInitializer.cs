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
        _logger.LogInformation("Starting initial data seeding.");

        List<Amenity> allAmenities = await SeedWorkspaceAmenitiesAsync(cancellationToken);
        await SeedWorkspacesAsync(allAmenities, cancellationToken);

        _logger.LogInformation("Saving changes to the database.");

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Initial data seeding completed successfully.");
    }

    private async Task<List<Amenity>> SeedWorkspaceAmenitiesAsync(CancellationToken cancellationToken)
    {
        List<Amenity> existingAmenities = await _dbContext.Amenities.ToListAsync(cancellationToken);

        var existingAmenityNames = existingAmenities.Select(amenity => amenity.Name).ToList();

        var newAmenityNames = _seedOptions.Workspaces
            .SelectMany(workspaceSeed => workspaceSeed.Amenities)
            .Where(name => !existingAmenityNames.Contains(name))
            .Distinct()
            .ToList();

        var newAmenities = newAmenityNames
            .Select(name => new Amenity { Name = name })
            .ToList();

        _dbContext.Amenities.AddRange(newAmenities);

        return existingAmenities.Concat(newAmenities).ToList();
    }

    private async Task SeedWorkspacesAsync(List<Amenity> allAmenities, CancellationToken cancellationToken)
    {
        bool hasAnyWorkspaces = await _dbContext.Workspaces.AnyAsync(cancellationToken);

        if (hasAnyWorkspaces)
        {
            return;
        }

        var workspaces = _seedOptions.Workspaces
            .Select(workspaceSeed => CreateWorkspace(allAmenities, workspaceSeed))
            .ToList();

        _dbContext.Workspaces.AddRange(workspaces);
    }

    private static Workspace CreateWorkspace(List<Amenity> allAmenities, WorkspaceSeed workspaceSeed)
    {
        List<Amenity> amenities = GetWorkspaceAmenities(allAmenities, workspaceSeed.Amenities);
        List<Desk> desks = CreateWorkspaceDesks(workspaceSeed.DeskCount);
        List<Room> rooms = CreateWorkspaceRooms(workspaceSeed.RoomConfigurations ?? []);

        var workspace = new Workspace
        {
            Name = workspaceSeed.Name,
            Description = workspaceSeed.Description,
            Amenities = amenities,
            Desks = desks,
            Rooms = rooms,
        };

        return workspace;
    }

    private static List<Amenity> GetWorkspaceAmenities(List<Amenity> allAmenities, string[] amenities) =>
        allAmenities
            .Where(amenity => amenities.Contains(amenity.Name))
            .ToList();

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
