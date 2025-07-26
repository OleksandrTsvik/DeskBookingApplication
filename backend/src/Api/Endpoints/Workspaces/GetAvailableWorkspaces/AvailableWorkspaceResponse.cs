namespace Api.Endpoints.Workspaces.GetAvailableWorkspaces;

public sealed record AvailableWorkspaceResponse(
    Guid Id,
    string Name,
    int DeskCount,
    List<int> RoomCapacities);
