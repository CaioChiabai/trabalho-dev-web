using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APICardapio.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRelationshipsWithDataCleanup : Migration
    {        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_itens_cardapio_categorias_categoria_id",
                table: "itens_cardapio");

            migrationBuilder.DropTable(
                name: "cardapio_itens");

            // Limpar dados existentes que podem causar conflitos
            migrationBuilder.Sql("DELETE FROM variacoes_item;");
            migrationBuilder.Sql("DELETE FROM itens_cardapio;");
            migrationBuilder.Sql("DELETE FROM categorias;");

            migrationBuilder.AddColumn<int>(
                name: "cardapio_id",
                table: "categorias",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_categorias_cardapio_id",
                table: "categorias",
                column: "cardapio_id");

            migrationBuilder.AddForeignKey(
                name: "FK_categorias_cardapios_cardapio_id",
                table: "categorias",
                column: "cardapio_id",
                principalTable: "cardapios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_itens_cardapio_categorias_categoria_id",
                table: "itens_cardapio",
                column: "categoria_id",
                principalTable: "categorias",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categorias_cardapios_cardapio_id",
                table: "categorias");

            migrationBuilder.DropForeignKey(
                name: "FK_itens_cardapio_categorias_categoria_id",
                table: "itens_cardapio");

            migrationBuilder.DropIndex(
                name: "IX_categorias_cardapio_id",
                table: "categorias");

            migrationBuilder.DropColumn(
                name: "cardapio_id",
                table: "categorias");

            migrationBuilder.CreateTable(
                name: "cardapio_itens",
                columns: table => new
                {
                    CardapiosId = table.Column<int>(type: "integer", nullable: false),
                    ItensCardapioId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cardapio_itens", x => new { x.CardapiosId, x.ItensCardapioId });
                    table.ForeignKey(
                        name: "FK_cardapio_itens_cardapios_CardapiosId",
                        column: x => x.CardapiosId,
                        principalTable: "cardapios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_cardapio_itens_itens_cardapio_ItensCardapioId",
                        column: x => x.ItensCardapioId,
                        principalTable: "itens_cardapio",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_cardapio_itens_ItensCardapioId",
                table: "cardapio_itens",
                column: "ItensCardapioId");

            migrationBuilder.AddForeignKey(
                name: "FK_itens_cardapio_categorias_categoria_id",
                table: "itens_cardapio",
                column: "categoria_id",
                principalTable: "categorias",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
