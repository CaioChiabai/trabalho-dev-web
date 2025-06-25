using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APICardapio.Migrations
{
    /// <inheritdoc />
    public partial class AddSenhaHashToUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "senha",
                table: "usuarios",
                newName: "senha_hash");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "senha_hash",
                table: "usuarios",
                newName: "senha");
        }
    }
}
