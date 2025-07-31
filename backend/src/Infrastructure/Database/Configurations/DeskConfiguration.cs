using Domain.Workspaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class DeskConfiguration : IEntityTypeConfiguration<Desk>
{
    public void Configure(EntityTypeBuilder<Desk> builder)
    {
        builder.HasKey(desk => desk.Id);

        builder
            .HasOne(desk => desk.Workspace)
            .WithMany(workspace => workspace.Desks)
            .HasForeignKey(desk => desk.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
