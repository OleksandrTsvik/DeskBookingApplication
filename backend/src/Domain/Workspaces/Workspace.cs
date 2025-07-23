using Domain.Bookings;

namespace Domain.Workspaces;

public sealed class Workspace
{
    public Guid Id { get; set; }

    public required string Name { get; set; }
    public required string Description { get; set; }
    public TimeSpan MaxBookingDuration { get; set; }

    public List<WorkspacePhoto> Photos { get; set; } = [];
    public List<Amenity> Amenities { get; set; } = [];
    public List<Desk> Desks { get; set; } = [];
    public List<Room> Rooms { get; set; } = [];
    public List<Booking> Bookings { get; set; } = [];
}
