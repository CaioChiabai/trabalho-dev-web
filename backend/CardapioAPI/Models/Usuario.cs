namespace CardapioAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string SenhaHash { get; set; }
        public string Cnpj { get; set; }
        public string Telefone { get; set; }
        public byte[]? Logo { get; set; }
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
        public bool Ativo { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        public byte[]? Banner { get; set; }
    }
}
