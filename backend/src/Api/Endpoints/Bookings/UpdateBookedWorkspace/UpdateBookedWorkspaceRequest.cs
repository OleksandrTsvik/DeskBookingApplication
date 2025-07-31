namespace Api.Endpoints.Bookings.UpdateBookedWorkspace;

public sealed record UpdateBookedWorkspaceRequest(
    Guid Id,
    string Name,
    string Email,
    Guid WorkspaceId,
    int? DeskCount,
    int? RoomCapacity,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly StartTime,
    TimeOnly EndTime);
