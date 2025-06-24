namespace Domain.Workspaces;

public sealed class WorkspacePhoto
{
    public Guid Id { get; set; }
    public Guid WorkspaceId { get; set; }

    public required string Url { get; set; }

    public Workspace? Workspace { get; set; }
}
