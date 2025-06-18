namespace Domain.Workspaces;

public sealed class Workspace
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public List<Desk>? Desks { get; set; }
    public List<Room>? Rooms { get; set; }
}
