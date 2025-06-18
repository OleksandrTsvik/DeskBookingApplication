using Domain.Workspaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class WorkspaceConfiguration : IEntityTypeConfiguration<Workspace>
{
    public void Configure(EntityTypeBuilder<Workspace> builder)
    {
        builder.HasKey(workspace => workspace.Id);

        builder
            .Property(workspace => workspace.Name)
            .IsRequired()
            .HasMaxLength(WorkspaceRules.MaxNameLength);
    }
}
