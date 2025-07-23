using Domain.Bookings;
using FluentValidation;

namespace Api.Endpoints.Bookings.BookWorkspace;

public class BookWorkspaceValidator : AbstractValidator<BookWorkspaceRequest>
{
    public BookWorkspaceValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(BookingRules.MinUserNameLength)
            .MaximumLength(BookingRules.MaxUserNameLength);

        RuleFor(x => x.Email)
            .EmailAddress()
            .MaximumLength(BookingRules.MaxUserEmailLength);

        RuleFor(x => x.WorkspaceId).NotEmpty();

        RuleFor(x => x.DeskCount)
            .GreaterThan(0)
            .When(x => x.DeskCount.HasValue);

        RuleFor(x => x.RoomCapacity)
            .GreaterThan(0)
            .When(x => x.RoomCapacity.HasValue);

        RuleFor(x => x.StartTime)
            .GreaterThan(_ => DateTime.UtcNow);

        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime);
    }
}
