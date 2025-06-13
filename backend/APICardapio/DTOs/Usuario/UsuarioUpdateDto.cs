using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.DTOs.Usuario
{ 
    [SwaggerSchema(Description = "Dados para atualizar um usuário existente (não inclui senha)")]
    public class UsuarioUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [SwaggerSchema(Description = "Novo nome do restaurante ou usuário")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
        [MaxLength(150, ErrorMessage = "Email deve ter no máximo 150 caracteres")]
        [SwaggerSchema(Description = "Novo email do usuário (deve ser único)")]
        public string Email { get; set; } = string.Empty;

        [SwaggerSchema(Description = "Indica se o usuário está ativo no sistema")]
        public bool Ativo { get; set; } = true;
    }
}