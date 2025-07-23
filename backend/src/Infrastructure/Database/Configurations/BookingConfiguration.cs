using Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public sealed class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(booking => booking.Id);

        builder
            .Property(booking => booking.UserName)
            .IsRequired()
            .HasMaxLength(BookingRules.MaxUserNameLength);

        builder
            .Property(booking => booking.UserEmail)
            .IsRequired()
            .HasMaxLength(BookingRules.MaxUserEmailLength);

        builder
            .Property(booking => booking.StartTime)
            .IsRequired();

        builder
            .Property(booking => booking.EndTime)
            .IsRequired();

        builder
            .HasOne(booking => booking.Workspace)
            .WithMany(workspace => workspace.Bookings)
            .HasForeignKey(booking => booking.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(booking => booking.Desks)
            .WithMany();

        builder
            .HasOne(booking => booking.Room)
            .WithOne()
            .HasForeignKey<Booking>(booking => booking.RoomId);
    }
}
