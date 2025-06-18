namespace Domain.Workspaces;

public sealed class Amenity
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public List<Workspace>? Workspaces { get; set; }
}
