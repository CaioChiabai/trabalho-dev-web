namespace APICardapio.DTOs.Usuario
{
    public class UsuarioLoginResponseDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Cnpj { get; set; }
        public string? Telefone { get; set; }
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}