namespace Api.Endpoints.Workspaces.GetBookableWorkspaces;

public sealed record BookableWorkspaceResponse(
    Guid Id,
    string Name,
    int DeskCount,
    List<int> RoomCapacities);
