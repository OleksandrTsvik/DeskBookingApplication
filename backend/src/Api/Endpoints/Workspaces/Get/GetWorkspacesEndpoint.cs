using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Workspaces.Get;

public sealed class GetWorkspacesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("workspaces", Handler)
            .WithTags(Tags.Workspaces);
    }

    public async Task<Ok<List<WorkspaceResponse>>> Handler(
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        List<WorkspaceResponse> workspaces = await dbContext.Workspaces
            .Select(workspace => new WorkspaceResponse(
                workspace.Id,
                workspace.Name,
                workspace.Description,
                workspace.Photos.Select(photo => photo.Url).ToList(),
                workspace.Amenities.Select(amenity => amenity.Name).ToList(),
                workspace.Desks.Count(),
                workspace.Rooms
                    .GroupBy(room => room.Capacity)
                    .Select(groupedRooms => new WorkspaceRoomResponse(
                        groupedRooms.Count(),
                        groupedRooms.Key))
                    .ToList(),
                workspace.Bookings
                    .Where(booking => booking.EndTime > DateTime.UtcNow)
                    .Select(booking => new UserBookingResponse(
                        booking.Desks.Count,
                        booking.Room!.Capacity,
                        booking.StartTime,
                        booking.EndTime))
                    .FirstOrDefault()))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(workspaces);
    }
}
