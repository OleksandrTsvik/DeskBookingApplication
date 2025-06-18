using Domain.Workspaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class AmenityConfiguration : IEntityTypeConfiguration<Amenity>
{
    public void Configure(EntityTypeBuilder<Amenity> builder)
    {
        builder.HasKey(amenity => amenity.Id);

        builder
            .Property(amenity => amenity.Name)
            .IsRequired()
            .HasMaxLength(AmenityRules.MaxNameLength);

        builder
            .HasIndex(amenity => amenity.Name)
            .IsUnique();

        builder
            .HasMany(amenity => amenity.Workspaces)
            .WithMany(workspace => workspace.Amenities);
    }
}
