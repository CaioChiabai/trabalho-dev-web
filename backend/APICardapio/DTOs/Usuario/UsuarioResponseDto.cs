using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.DTOs.Usuario
{ 
    [SwaggerSchema(Description = "Dados completos do usuário retornados pela API (sem senha)")]
    public class UsuarioResponseDto
    {
        [SwaggerSchema(Description = "ID único do usuário no sistema")]
        public int Id { get; set; }

        [SwaggerSchema(Description = "Nome completo do restaurante ou usuário")]
        public string Nome { get; set; } = string.Empty;

        [SwaggerSchema(Description = "Email de contato e login do usuário")]
        public string Email { get; set; } = string.Empty;

        [SwaggerSchema(Description = "Data e hora de criação do usuário")]
        public DateTime DataCriacao { get; set; }

        [SwaggerSchema(Description = "Indica se o usuário está ativo no sistema")]
        public bool Ativo { get; set; }
    }
}