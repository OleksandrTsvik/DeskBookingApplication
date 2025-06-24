using System.Reflection;
using Domain.Workspaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Database;

public sealed class ApplicationDbContext : DbContext
{
    public DbSet<Amenity> Amenities { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Desk> Desks { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Workspace> Workspaces { get; set; }
    public DbSet<WorkspacePhoto> WorkspacePhotos { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(
            Assembly.GetExecutingAssembly(),
            ApplicationDbConfigurationsFilter);

        base.OnModelCreating(builder);
    }

    private static bool ApplicationDbConfigurationsFilter(Type type) =>
        type.FullName?.Contains("Database.Configurations") ?? false;
}
