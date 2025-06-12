using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APICardapio.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;

        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        [MaxLength(20)]
        [Column("cnpj")]
        public string? Cnpj { get; set; }

        [MaxLength(20)]
        [Column("telefone")]
        public string? Telefone { get; set; }

        [Column("logo")]
        public byte[]? Logo { get; set; }

        [Column("data_atualizacao")]
        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

        [Column("banner")]
        public byte[]? Banner { get; set; }

        [MaxLength(50)]
        [Column("role")]
        public string Role { get; set; } = "user";

        // Relacionamentos
        public virtual ICollection<Cardapio> Cardapios { get; set; } = new List<Cardapio>();
    }
}