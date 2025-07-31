namespace Api.Endpoints.Bookings.GetBookedWorkspaces;

public sealed record BookedWorkspaceResponse(
    Guid Id,
    string Name,
    string? Photo,
    int? DeskCount,
    int? RoomCapacity,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly StartTime,
    TimeOnly EndTime);
