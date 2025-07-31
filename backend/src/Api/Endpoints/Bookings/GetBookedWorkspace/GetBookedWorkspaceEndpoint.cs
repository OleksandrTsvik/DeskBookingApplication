using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Bookings.GetBookedWorkspace;

public sealed class GetBookedWorkspaceEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("bookings/{id:guid}", Handler)
            .WithTags(Tags.Bookings);
    }

    public static async Task<Results<Ok<BookedWorkspaceResponse>, NotFound>> Handler(
        [FromRoute] Guid id,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        BookedWorkspaceResponse? bookedWorkspace = await dbContext.Bookings
            .Where(booking => booking.Id == id)
            .Select(booking => new BookedWorkspaceResponse(
                booking.Id,
                booking.WorkspaceId,
                booking.UserName,
                booking.UserEmail,
                booking.Desks.Count,
                booking.Room!.Capacity,
                booking.StartDate,
                booking.EndDate,
                booking.StartTime,
                booking.EndTime))
            .FirstOrDefaultAsync(cancellationToken);

        if (bookedWorkspace is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(bookedWorkspace);
    }
}
