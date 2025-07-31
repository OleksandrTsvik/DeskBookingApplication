namespace Domain.Workspaces;

public sealed class Desk
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }

    public Workspace? Workspace { get; set; }
}
