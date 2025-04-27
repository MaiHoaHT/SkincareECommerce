using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkincareWebBackend.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBrandTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Banner",
                table: "Brands",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Banner",
                table: "Brands");
        }
    }
}
