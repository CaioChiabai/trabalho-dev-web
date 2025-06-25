using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.DTOs.Usuario
{ 
    [SwaggerSchema(Description = "Dados para atualizar um usuário/restaurante existente")]
    public class UsuarioUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [SwaggerSchema(Description = "Novo nome do restaurante")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
        [MaxLength(150, ErrorMessage = "Email deve ter no máximo 150 caracteres")]
        [SwaggerSchema(Description = "Novo email do restaurante (deve ser único)")]
        public string Email { get; set; } = string.Empty;        [MaxLength(20, ErrorMessage = "CNPJ deve ter no máximo 20 caracteres")]
        [SwaggerSchema(Description = "CNPJ do restaurante")]
        public string? Cnpj { get; set; }

        [MaxLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        [SwaggerSchema(Description = "Telefone de contato do restaurante")]
        public string? Telefone { get; set; }

        [SwaggerSchema(Description = "Logo do restaurante (arquivo de imagem)")]
        public IFormFile? Logo { get; set; }

        [SwaggerSchema(Description = "Banner do restaurante (arquivo de imagem)")]
        public IFormFile? Banner { get; set; }

        [SwaggerSchema(Description = "Indica se o usuário está ativo no sistema")]
        public bool Ativo { get; set; } = true;
    }
}