using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Workspaces.GetAvailableWorkspaces;

public sealed class GetAvailableWorkspacesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("workspaces/available", Handler)
            .WithTags(Tags.Workspaces);
    }

    public static async Task<Ok<List<AvailableWorkspaceResponse>>> Handler(
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        List<AvailableWorkspaceResponse> workspaces = await dbContext.Workspaces
            .Select(workspace => new AvailableWorkspaceResponse(
                workspace.Id,
                workspace.Name,
                workspace.Desks.Count(),
                workspace.Rooms
                    .Select(room => room.Capacity)
                    .Distinct()
                    .ToList()))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(workspaces);
    }
}
