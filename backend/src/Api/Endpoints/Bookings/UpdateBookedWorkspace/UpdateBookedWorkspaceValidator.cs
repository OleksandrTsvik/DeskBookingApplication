using Domain.Bookings;
using FluentValidation;

namespace Api.Endpoints.Bookings.UpdateBookedWorkspace;

public sealed class UpdateBookedWorkspaceValidator : AbstractValidator<UpdateBookedWorkspaceRequest>
{
    public UpdateBookedWorkspaceValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(BookingRules.MinUserNameLength)
            .MaximumLength(BookingRules.MaxUserNameLength);

        RuleFor(x => x.Email)
            .EmailAddress()
            .MaximumLength(BookingRules.MaxUserEmailLength);

        RuleFor(x => x.WorkspaceId).NotEmpty();

        RuleFor(x => x.DeskCount)
            .GreaterThanOrEqualTo(0)
            .When(x => x.DeskCount.HasValue);

        RuleFor(x => x.RoomCapacity)
            .GreaterThan(0)
            .When(x => x.RoomCapacity.HasValue);

        RuleFor(x => x.StartDate)
            .GreaterThanOrEqualTo(_ => DateOnly.FromDateTime(DateTime.Now));

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate);

        RuleFor(x => x.StartTime)
            .GreaterThan(_ => TimeOnly.FromDateTime(DateTime.Now))
            .When(x => x.StartDate == DateOnly.FromDateTime(DateTime.Now));

        RuleFor(x => x.EndTime)
            .GreaterThan(x => x.StartTime);
    }
}
