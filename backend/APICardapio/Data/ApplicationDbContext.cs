using APICardapio.Models;
using Microsoft.EntityFrameworkCore;

namespace APICardapio.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Cardapio> Cardapios { get; set; }
        public DbSet<ItemCardapio> ItensCardapio { get; set; }
        public DbSet<VariacaoItem> VariacoesItem { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações da entidade Usuario
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.DataAtualizacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });            // Configurações da entidade Categoria
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.DataAtualizacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasIndex(e => e.Nome);
                
                entity.HasOne(c => c.Cardapio)
                    .WithMany(ca => ca.Categorias)
                    .HasForeignKey(c => c.CardapioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configurações da entidade Cardapio
            modelBuilder.Entity<Cardapio>(entity =>
            {
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.DataAtualizacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                entity.HasOne(c => c.Usuario)
                    .WithMany(u => u.Cardapios)
                    .HasForeignKey(c => c.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configurações da entidade ItemCardapio
            modelBuilder.Entity<ItemCardapio>(entity =>
            {
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.DataAtualizacao).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.Preco).HasPrecision(10, 2);
                
                entity.HasOne(i => i.Categoria)
                    .WithMany(c => c.ItensCardapio)
                    .HasForeignKey(i => i.CategoriaId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configurações da entidade VariacaoItem
            modelBuilder.Entity<VariacaoItem>(entity =>
            {
                entity.Property(e => e.PrecoAdicional).HasPrecision(10, 2);
                
                entity.HasOne(v => v.ItemCardapio)
                    .WithMany(i => i.VariacoesItem)
                    .HasForeignKey(v => v.ItemId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
