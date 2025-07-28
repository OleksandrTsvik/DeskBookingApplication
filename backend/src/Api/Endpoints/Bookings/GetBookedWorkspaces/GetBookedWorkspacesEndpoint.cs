using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Bookings.GetBookedWorkspaces;

public sealed class GetBookedWorkspacesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("bookings", Handler)
            .WithTags(Tags.Bookings);
    }

    public static async Task<Ok<List<BookedWorkspaceResponse>>> Handler(
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        List<BookedWorkspaceResponse> bookedWorkspaces = await dbContext.Bookings
            .OrderByDescending(booking => booking.EndDate)
            .Select(booking => new BookedWorkspaceResponse(
                booking.Id,
                booking.Workspace!.Name,
                booking.Workspace.Photos
                    .Select(photo => photo.Url)
                    .FirstOrDefault(),
                booking.Desks.Count,
                booking.Room!.Capacity,
                booking.StartDate,
                booking.EndDate,
                booking.StartTime,
                booking.EndTime))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(bookedWorkspaces);
    }
}
