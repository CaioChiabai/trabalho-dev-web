using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APICardapio.Models
{
    [Table("variacoes_item")]
    public class VariacaoItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("preco_adicional")]
        public decimal PrecoAdicional { get; set; } = 0;

        [Column("disponivel")]
        public bool Disponivel { get; set; } = true;

        // Relacionamentos
        [ForeignKey("ItemId")]
        public virtual ItemCardapio ItemCardapio { get; set; } = null!;
    }
}
