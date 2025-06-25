using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.DTOs.Usuario
{ 
    [SwaggerSchema(Description = "Dados completos do usuário/restaurante retornados pela API (sem senha)")]
    public class UsuarioResponseDto
    {
        [SwaggerSchema(Description = "ID único do usuário no sistema")]
        public int Id { get; set; }

        [SwaggerSchema(Description = "Nome completo do restaurante")]
        public string Nome { get; set; } = string.Empty;

        [SwaggerSchema(Description = "Email de contato e login do restaurante")]
        public string Email { get; set; } = string.Empty;

        [SwaggerSchema(Description = "CNPJ do restaurante")]
        public string? Cnpj { get; set; }

        [SwaggerSchema(Description = "Telefone de contato do restaurante")]
        public string? Telefone { get; set; }

        [SwaggerSchema(Description = "Logo do restaurante (URL ou base64)")]
        public string? LogoUrl { get; set; }

        [SwaggerSchema(Description = "Banner do restaurante (URL ou base64)")]
        public string? BannerUrl { get; set; }

        [SwaggerSchema(Description = "Data e hora de criação do usuário")]
        public DateTime DataCriacao { get; set; }

        [SwaggerSchema(Description = "Data e hora da última atualização")]
        public DateTime DataAtualizacao { get; set; }

        [SwaggerSchema(Description = "Indica se o usuário está ativo no sistema")]
        public bool Ativo { get; set; }
    }
}