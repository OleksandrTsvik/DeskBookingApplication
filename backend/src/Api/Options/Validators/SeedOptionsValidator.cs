using Domain.Workspaces;
using FluentValidation;
using Infrastructure.Options;

namespace Api.Options.Validators;

public sealed class SeedOptionsValidator : AbstractValidator<SeedOptions>
{
    public SeedOptionsValidator()
    {
        RuleFor(x => x.Workspaces).NotNull();

        RuleForEach(x => x.Workspaces).ChildRules(workspace =>
        {
            workspace.RuleFor(x => x.Name)
                .MinimumLength(WorkspaceRules.MinNameLength)
                .MaximumLength(WorkspaceRules.MaxNameLength);

            workspace.RuleFor(x => x.Description)
                .MinimumLength(WorkspaceRules.MinDescriptionLength)
                .MaximumLength(WorkspaceRules.MaxDescriptionLength);

            workspace.RuleFor(x => x.MaxBookingDurationInDays).GreaterThan(0);

            workspace.RuleFor(x => x.PhotoUrls).NotNull();
            workspace.RuleForEach(x => x.PhotoUrls).NotEmpty();

            workspace.RuleFor(x => x.Amenities).NotNull();
            workspace.RuleForEach(x => x.Amenities).NotEmpty();

            workspace.RuleFor(x => x.DeskCount).GreaterThanOrEqualTo(0);

            workspace.RuleForEach(x => x.RoomConfigurations)
                .ChildRules(roomConfiguration =>
                {
                    roomConfiguration.RuleFor(x => x.Count).GreaterThan(0);

                    roomConfiguration.RuleFor(x => x.Capacity).GreaterThan(0);
                });
        });
    }
}
