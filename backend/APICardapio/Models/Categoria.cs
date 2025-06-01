using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APICardapio.Models
{
    [Table("categorias")]
    public class Categoria
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("cardapio_id")]
        public int CardapioId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("icone")]
        public byte[]? Icone { get; set; }

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        [Column("ordem")]
        public int Ordem { get; set; } = 0;

        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        [Column("data_atualizacao")]
        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

        // Relacionamentos
        [ForeignKey("CardapioId")]
        public virtual Cardapio Cardapio { get; set; } = null!;

        public virtual ICollection<ItemCardapio> ItensCardapio { get; set; } = new List<ItemCardapio>();
    }
}
