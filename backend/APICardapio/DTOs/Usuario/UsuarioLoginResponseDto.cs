namespace APICardapio.DTOs.Usuario
{
    public class UsuarioLoginResponseDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }
}