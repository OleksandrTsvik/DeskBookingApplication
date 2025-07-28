using Domain.Bookings;
using Domain.Workspaces;
using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Bookings.UpdateBookedWorkspace;

public sealed class UpdateBookedWorkspaceEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("bookings", Handler)
            .WithRequestValidation<UpdateBookedWorkspaceRequest>()
            .WithTags(Tags.Bookings);
    }

    public static async Task<Results<NoContent, NotFound<string>, BadRequest<string>>> Handler(
        UpdateBookedWorkspaceRequest request,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        Booking? booking = await dbContext.Bookings
            .Include(booking => booking.Desks)
            .Include(booking => booking.Room)
            .Where(booking => booking.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (booking is null)
        {
            return TypedResults.NotFound("Booking not found.");
        }

        Workspace? workspace = await GetWorkspaceAsync(request.WorkspaceId, booking.Id, dbContext, cancellationToken);

        if (workspace is null)
        {
            return TypedResults.BadRequest("Workspace not found.");
        }

        int bookingDuration = request.EndDate.DayNumber - request.StartDate.DayNumber + 1;

        if (bookingDuration > workspace.MaxBookingDuration.Days)
        {
            return TypedResults.BadRequest("Booking duration exceeds maximum allowed.");
        }

        bool userHasBooking = workspace.Bookings.Any(b => b.Id != booking.Id);

        if (userHasBooking)
        {
            return TypedResults.BadRequest("You already have an active booking for this workspace.");
        }

        List<Desk> updatedDesks = GetUpdatedDesks(booking, workspace, request.DeskCount);

        if (request.DeskCount.HasValue && updatedDesks.Count != request.DeskCount.Value)
        {
            return TypedResults.BadRequest("Not enough available desks.");
        }

        Room? updatedRoom = GetUpdatedRoom(booking, workspace, request.RoomCapacity);

        if (request.RoomCapacity.HasValue && updatedRoom is null)
        {
            return TypedResults.BadRequest("No available room matches the requested size.");
        }

        booking.WorkspaceId = workspace.Id;
        booking.UserName = request.Name;
        booking.UserEmail = request.Email;
        booking.StartDate = request.StartDate;
        booking.EndDate = request.EndDate;
        booking.StartTime = request.StartTime;
        booking.EndTime = request.EndTime;
        booking.Desks = updatedDesks;
        booking.Room = updatedRoom;

        await dbContext.SaveChangesAsync(cancellationToken);

        return TypedResults.NoContent();
    }

    private static Task<Workspace?> GetWorkspaceAsync(
        Guid workspaceId,
        Guid bookingId,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        return dbContext.Workspaces
            .AsSplitQuery()
            .Include(workspace => workspace.Desks)
            .Include(workspace => workspace.Rooms)
            .Include(workspace => workspace.Bookings
                .Where(booking =>
                    booking.Id != bookingId &&
                    booking.EndDate >= DateOnly.FromDateTime(DateTime.Now)))
                .ThenInclude(booking => booking.Room)
            .Include(workspace => workspace.Bookings)
                .ThenInclude(booking => booking.Desks)
            .Where(workspace => workspace.Id == workspaceId)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private static List<Desk> GetUpdatedDesks(
        Booking currentBooking,
        Workspace selectedWorkspace,
        int? deskCount)
    {
        if (!deskCount.HasValue || deskCount == 0)
        {
            return [];
        }

        if (currentBooking.WorkspaceId == selectedWorkspace.Id && currentBooking.Desks.Count >= deskCount)
        {
            return currentBooking.Desks.Take(deskCount.Value).ToList();
        }

        var bookedDeskIds = selectedWorkspace.Bookings
            .SelectMany(booking => booking.Desks)
            .Select(desk => desk.Id)
            .Concat(currentBooking.Desks.Select(desk => desk.Id))
            .ToHashSet();

        var availableDesks = selectedWorkspace.Desks
            .Where(desk => !bookedDeskIds.Contains(desk.Id))
            .Take(deskCount.Value)
            .ToList();

        if (currentBooking.Desks.Count == 0)
        {
            return availableDesks;
        }

        int additionalDeskCount = Math.Max(0, deskCount.Value - currentBooking.Desks.Count);

        return currentBooking.Desks
            .Concat(availableDesks.Take(additionalDeskCount))
            .ToList();
    }

    private static Room? GetUpdatedRoom(
        Booking currentBooking,
        Workspace selectedWorkspace,
        int? roomCapacity)
    {
        if (!roomCapacity.HasValue)
        {
            return null;
        }

        if (currentBooking.Room is not null &&
            currentBooking.WorkspaceId == selectedWorkspace.Id &&
            currentBooking.Room.Capacity == roomCapacity)
        {
            return currentBooking.Room;
        }

        var bookedRoomIds = selectedWorkspace.Bookings
            .Where(booking => booking.Room != null)
            .Select(booking => booking.Room!.Id)
            .ToHashSet();

        if (currentBooking.Room is not null)
        {
            bookedRoomIds.Add(currentBooking.Room.Id);
        }

        Room? availableRoom = selectedWorkspace.Rooms
            .FirstOrDefault(room => room.Capacity == roomCapacity.Value && !bookedRoomIds.Contains(room.Id));

        return availableRoom;
    }
}
