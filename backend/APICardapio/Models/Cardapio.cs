using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace APICardapio.Models
{
    [Table("cardapios")]
    public class Cardapio
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Required]
        [MaxLength(150)]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(500)]
        [Column("descricao")]
        public string? Descricao { get; set; }

        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        [Column("data_atualizacao")]
        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;        // Relacionamentos
        [ForeignKey("UsuarioId")]
        [System.Text.Json.Serialization.JsonIgnore]
        [JsonIgnore]
        public virtual Usuario? Usuario { get; set; } // Removido Required, agora nullable

        public virtual ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
    }
}
