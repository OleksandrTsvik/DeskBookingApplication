using Domain.Workspaces;
using Infrastructure.Database;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints.Workspaces.Get;

public sealed class GetWorkspacesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("workspaces", Handler)
            .WithTags(Tags.Workspaces);
    }

    public async Task<Ok<List<Workspace>>> Handler(
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken)
    {
        List<Workspace> workspaces = await dbContext.Workspaces.ToListAsync(cancellationToken);

        return TypedResults.Ok(workspaces);
    }
}
