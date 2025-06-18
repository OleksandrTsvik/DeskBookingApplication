namespace Domain.Workspaces;

public sealed class Booking
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }
    public Guid? DeskId { get; set; }
    public Guid? RoomId { get; set; }

    public required string UserName { get; set; }
    public required string UserEmail { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public Workspace? Workspace { get; set; }
    public Desk? Desk { get; set; }
    public Room? Room { get; set; }
}
