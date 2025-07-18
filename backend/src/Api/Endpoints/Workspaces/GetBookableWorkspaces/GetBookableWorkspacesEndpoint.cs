using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Workspaces.GetBookableWorkspaces;

public sealed class GetBookableWorkspacesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("workspaces/book", Handler)
            .WithTags(Tags.Workspaces);
    }

    public async Task<Ok<List<BookableWorkspaceResponse>>> Handler(
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        List<BookableWorkspaceResponse> workspaces = await dbContext.Workspaces
            .Select(workspace => new BookableWorkspaceResponse(
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
