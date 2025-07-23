using Domain.Bookings;
using Domain.Workspaces;
using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Bookings.BookWorkspace;

public class BookWorkspaceEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("bookings", Handler)
            .WithRequestValidation<BookWorkspaceRequest>()
            .WithTags(Tags.Bookings);
    }

    public async Task<Results<NoContent, BadRequest<string>>> Handler(
        BookWorkspaceRequest request,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        Workspace? workspace = await dbContext.Workspaces
            .Include(workspace => workspace.Desks)
            .Include(workspace => workspace.Rooms)
            .Where(workspace => workspace.Id == request.WorkspaceId)
            .FirstOrDefaultAsync(cancellationToken);

        if (workspace is null)
        {
            return TypedResults.BadRequest("Workspace not found.");
        }

        TimeSpan bookingDuration = request.EndTime - request.StartTime;

        if (bookingDuration > workspace.MaxBookingDuration)
        {
            return TypedResults.BadRequest("Booking duration exceeds maximum allowed.");
        }

        bool userHasBooking = await dbContext.Bookings
            .Where(booking =>
                booking.WorkspaceId == workspace.Id &&
                booking.UserEmail == request.Email &&
                booking.EndTime > DateTime.UtcNow)
            .AnyAsync(cancellationToken);

        if (userHasBooking)
        {
            return TypedResults.BadRequest("You already have an active booking for this workspace.");
        }

        List<Booking> currentBookings = await dbContext.Bookings
            .AsNoTracking()
            .Include(workspace => workspace.Desks)
            .Include(workspace => workspace.Room)
            .Where(booking =>
                booking.WorkspaceId == workspace.Id &&
                booking.EndTime > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        List<Desk> availableDesks = GetAvailableDesks(currentBookings, workspace.Desks, request.DeskCount);

        if (request.DeskCount.HasValue && availableDesks.Count != request.DeskCount.Value)
        {
            return TypedResults.BadRequest("Not enough available desks.");
        }

        Room? availableRoom = GetAvailableRoom(currentBookings, workspace.Rooms, request.RoomCapacity);

        if (request.RoomCapacity.HasValue && availableRoom is null)
        {
            return TypedResults.BadRequest("No available room matches the requested size.");
        }

        var booking = new Booking
        {
            WorkspaceId = workspace.Id,
            UserName = request.Name,
            UserEmail = request.Email,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Desks = availableDesks,
            Room = availableRoom,
        };

        dbContext.Bookings.Add(booking);

        await dbContext.SaveChangesAsync(cancellationToken);

        return TypedResults.NoContent();
    }

    private static List<Desk> GetAvailableDesks(
        List<Booking> currentBookings,
        List<Desk> workspaceDesks,
        int? deskCount)
    {
        if (!deskCount.HasValue)
        {
            return [];
        }

        var bookedDeskIds = currentBookings
            .SelectMany(booking => booking.Desks)
            .Select(desk => desk.Id)
            .ToHashSet();

        var availableDesks = workspaceDesks
            .Where(desk => !bookedDeskIds.Contains(desk.Id))
            .Take(deskCount.Value)
            .ToList();

        return availableDesks;
    }

    private static Room? GetAvailableRoom(
        List<Booking> currentBookings,
        List<Room> workspaceRooms,
        int? roomCapacity)
    {
        if (!roomCapacity.HasValue)
        {
            return null;
        }

        var bookedRoomIds = currentBookings
            .Where(booking => booking.Room != null)
            .Select(booking => booking.Room!.Id)
            .ToHashSet();

        Room? availableRoom = workspaceRooms
            .FirstOrDefault(room => room.Capacity == roomCapacity.Value && !bookedRoomIds.Contains(room.Id));

        return availableRoom;
    }
}
