namespace Api.Endpoints.Workspaces.Get;

public sealed record WorkspaceResponse(
    Guid Id,
    string Name,
    string Description,
    List<string> Photos,
    List<string> Amenities,
    int DeskCount,
    List<WorkspaceRoomResponse> Rooms);

public sealed record WorkspaceRoomResponse(
    int Count,
    int Capacity);
