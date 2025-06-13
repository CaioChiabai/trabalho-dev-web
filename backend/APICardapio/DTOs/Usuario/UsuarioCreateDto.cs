using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.DTOs.Usuario
{

    [SwaggerSchema(Description = "Dados necessários para criar um novo usuário no sistema")]
    public class UsuarioCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [SwaggerSchema(Description = "Nome do restaurante ou usuário")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
        [MaxLength(150, ErrorMessage = "Email deve ter no máximo 150 caracteres")]
        [SwaggerSchema(Description = "Email único do usuário para login")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
        [SwaggerSchema(Description = "Senha de acesso (mínimo 6 caracteres)")]
        public string Senha { get; set; } = string.Empty;
    }
}    