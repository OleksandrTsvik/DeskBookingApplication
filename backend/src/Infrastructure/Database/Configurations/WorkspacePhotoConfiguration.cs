using Domain.Workspaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class WorkspacePhotoConfiguration : IEntityTypeConfiguration<WorkspacePhoto>
{
    public void Configure(EntityTypeBuilder<WorkspacePhoto> builder)
    {
        builder.HasKey(workspacePhoto => workspacePhoto.Id);

        builder
            .Property(workspacePhoto => workspacePhoto.Url)
            .IsRequired();

        builder
            .HasIndex(workspacePhoto => workspacePhoto.Url)
            .IsUnique();

        builder
            .HasOne(workspacePhoto => workspacePhoto.Workspace)
            .WithMany(workspace => workspace.Photos)
            .HasForeignKey(workspacePhoto => workspacePhoto.WorkspaceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
