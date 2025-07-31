namespace Domain.Workspaces;

public sealed class Room
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }

    public int Capacity { get; set; }

    public Workspace? Workspace { get; set; }
}
