
using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Bookings.CancelWorkspaceBooking;

public class CancelWorkspaceBookingEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("bookings/{id:guid}", Handler)
            .WithTags(Tags.Bookings);
    }

    public static async Task<Ok> Handler(
        [FromRoute] Guid id,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        await dbContext.Bookings
            .Where(booking => booking.Id == id)
            .ExecuteDeleteAsync(cancellationToken);

        return TypedResults.Ok();
    }
}
