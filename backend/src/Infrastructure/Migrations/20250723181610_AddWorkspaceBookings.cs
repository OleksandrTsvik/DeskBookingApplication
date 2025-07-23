using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkspaceBookings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_bookings_desks_desk_id",
                table: "bookings");

            migrationBuilder.DropIndex(
                name: "ix_bookings_desk_id",
                table: "bookings");

            migrationBuilder.DropIndex(
                name: "ix_bookings_workspace_id",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "desk_id",
                table: "bookings");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "max_booking_duration",
                table: "workspaces",
                type: "interval",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.CreateTable(
                name: "booking_desk",
                columns: table => new
                {
                    booking_id = table.Column<Guid>(type: "uuid", nullable: false),
                    desks_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_booking_desk", x => new { x.booking_id, x.desks_id });
                    table.ForeignKey(
                        name: "fk_booking_desk_bookings_booking_id",
                        column: x => x.booking_id,
                        principalTable: "bookings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_booking_desk_desks_desks_id",
                        column: x => x.desks_id,
                        principalTable: "desks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_bookings_workspace_id",
                table: "bookings",
                column: "workspace_id");

            migrationBuilder.CreateIndex(
                name: "ix_booking_desk_desks_id",
                table: "booking_desk",
                column: "desks_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "booking_desk");

            migrationBuilder.DropIndex(
                name: "ix_bookings_workspace_id",
                table: "bookings");

            migrationBuilder.DropColumn(
                name: "max_booking_duration",
                table: "workspaces");

            migrationBuilder.AddColumn<Guid>(
                name: "desk_id",
                table: "bookings",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_bookings_desk_id",
                table: "bookings",
                column: "desk_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_bookings_workspace_id",
                table: "bookings",
                column: "workspace_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_bookings_desks_desk_id",
                table: "bookings",
                column: "desk_id",
                principalTable: "desks",
                principalColumn: "id");
        }
    }
}
