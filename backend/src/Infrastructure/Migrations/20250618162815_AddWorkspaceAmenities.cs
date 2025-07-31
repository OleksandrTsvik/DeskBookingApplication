using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkspaceAmenities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "amenities",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_amenities", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "amenity_workspace",
                columns: table => new
                {
                    amenities_id = table.Column<Guid>(type: "uuid", nullable: false),
                    workspaces_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_amenity_workspace", x => new { x.amenities_id, x.workspaces_id });
                    table.ForeignKey(
                        name: "fk_amenity_workspace_amenities_amenities_id",
                        column: x => x.amenities_id,
                        principalTable: "amenities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_amenity_workspace_workspaces_workspaces_id",
                        column: x => x.workspaces_id,
                        principalTable: "workspaces",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_workspaces_name",
                table: "workspaces",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_amenities_name",
                table: "amenities",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_amenity_workspace_workspaces_id",
                table: "amenity_workspace",
                column: "workspaces_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "amenity_workspace");

            migrationBuilder.DropTable(
                name: "amenities");

            migrationBuilder.DropIndex(
                name: "ix_workspaces_name",
                table: "workspaces");
        }
    }
}
