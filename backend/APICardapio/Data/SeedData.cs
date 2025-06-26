using APICardapio.Models;
using Microsoft.EntityFrameworkCore;

namespace APICardapio.Data
{
    public static class SeedData
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            try
            {
                // Verificar se já existem usuários
                if (await context.Usuarios.AnyAsync())
                {
                    return; // Dados já foram inseridos
                }

                // Criar usuários de exemplo
                var usuarios = new List<Usuario>
                {
                new Usuario
                {
                    Nome = "Administrador",
                    Email = "admin@cardapio.com",
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                },
                new Usuario
                {
                    Nome = "João Silva",
                    Email = "joao@restaurante.com",
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                },
                new Usuario
                {
                    Nome = "Maria Santos",
                    Email = "maria@cardapio.com",
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword("minhasenha"),
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                }
                };

                await context.Usuarios.AddRangeAsync(usuarios);
                await context.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Log error if needed, but don't throw to prevent app from crashing
            }
        }
    }
}