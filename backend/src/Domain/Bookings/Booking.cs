using Domain.Workspaces;

namespace Domain.Bookings;

public sealed class Booking
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public Guid? RoomId { get; set; }

    public required string UserName { get; set; }
    public required string UserEmail { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

    public Workspace? Workspace { get; set; }
    public List<Desk> Desks { get; set; } = [];
    public Room? Room { get; set; }
}
