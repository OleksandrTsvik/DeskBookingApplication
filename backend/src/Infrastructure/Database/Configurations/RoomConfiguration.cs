using Domain.Workspaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.HasKey(room => room.Id);

        builder
            .Property(room => room.Capacity)
            .IsRequired();

        builder
            .HasOne(room => room.Workspace)
            .WithMany(workspace => workspace.Rooms)
            .HasForeignKey(room => room.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
