namespace Api.Endpoints.Bookings.GetBookedWorkspace;

public sealed record BookedWorkspaceResponse(
    Guid Id,
    Guid WorkspaceId,
    string Name,
    string Email,
    int? DeskCount,
    int? RoomCapacity,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly StartTime,
    TimeOnly EndTime);
