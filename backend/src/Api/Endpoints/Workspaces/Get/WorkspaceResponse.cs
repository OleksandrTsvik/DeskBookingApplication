namespace Api.Endpoints.Workspaces.Get;

public sealed record WorkspaceResponse(
    Guid Id,
    string Name,
    string Description,
    List<string> Photos,
    List<string> Amenities,
    int DeskCount,
    List<WorkspaceRoomResponse> Rooms,
    UserBookingResponse? UserBooking);

public sealed record WorkspaceRoomResponse(
    int Count,
    int Capacity);

public sealed record UserBookingResponse(
    int? DeskCount,
    int? RoomCapacity,
    DateOnly StartDate,
    DateOnly EndDate);
