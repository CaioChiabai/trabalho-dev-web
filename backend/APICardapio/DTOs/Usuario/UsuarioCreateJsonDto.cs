using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.DTOs.Usuario
{
    [SwaggerSchema(Description = "Dados necessários para criar um novo usuário/restaurante via JSON (sem arquivos)")]
    public class UsuarioCreateJsonDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        [SwaggerSchema(Description = "Nome do restaurante")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
        [MaxLength(150, ErrorMessage = "Email deve ter no máximo 150 caracteres")]
        [SwaggerSchema(Description = "Email único do restaurante para login")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "CNPJ é obrigatório")]
        [MaxLength(20, ErrorMessage = "CNPJ deve ter no máximo 20 caracteres")]
        [SwaggerSchema(Description = "CNPJ do restaurante")]
        public string Cnpj { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefone é obrigatório")]
        [MaxLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        [SwaggerSchema(Description = "Telefone de contato do restaurante")]
        public string Telefone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
        [SwaggerSchema(Description = "Senha de acesso (mínimo 6 caracteres)")]
        public string Senha { get; set; } = string.Empty;
    }
}
