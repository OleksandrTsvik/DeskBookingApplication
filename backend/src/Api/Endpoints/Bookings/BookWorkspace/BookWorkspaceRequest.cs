namespace Api.Endpoints.Bookings.BookWorkspace;

public sealed record BookWorkspaceRequest(
    string Name,
    string Email,
    Guid WorkspaceId,
    int? DeskCount,
    int? RoomCapacity,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly StartTime,
    TimeOnly EndTime);
