using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APICardapio.Models
{
    [Table("itens_cardapio")]
    public class ItemCardapio
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("categoria_id")]
        public int CategoriaId { get; set; }

        [Required]
        [MaxLength(150)]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(1000)]
        [Column("descricao")]
        public string? Descricao { get; set; }

        [Column("imagem")]
        public byte[]? Imagem { get; set; }

        [Column("disponivel")]
        public bool Disponivel { get; set; } = true;

        [Column("ordem")]
        public int Ordem { get; set; } = 0;

        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;        [Column("preco")]
        public decimal? Preco { get; set; }

        [Column("data_atualizacao")]
        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;        // Relacionamentos
        [ForeignKey("CategoriaId")]
        [System.Text.Json.Serialization.JsonIgnore]
        [Newtonsoft.Json.JsonIgnore]
        public virtual Categoria? Categoria { get; set; } // Agora nullable e ignorado na serialização

        public virtual ICollection<VariacaoItem> VariacoesItem { get; set; } = new List<VariacaoItem>();
    }
}
