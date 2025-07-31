namespace Infrastructure.Options;

public sealed class SeedOptions
{
    public static readonly string ConfigurationSectionName = "Seed";

    public required WorkspaceSeed[] Workspaces { get; init; }
}

public sealed class WorkspaceSeed
{
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int MaxBookingDurationInDays { get; init; }
    public required string[] PhotoUrls { get; init; }
    public required string[] Amenities { get; init; }
    public required int DeskCount { get; init; }
    public required RoomConfigurationSeed[]? RoomConfigurations { get; init; }
}

public sealed class RoomConfigurationSeed
{
    public required int Count { get; init; }
    public required int Capacity { get; init; }
}
