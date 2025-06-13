using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICardapio.Models;
using APICardapio.Data;

namespace APICardapio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/categorias
        [HttpGet]
        public async Task<IActionResult> GetCategorias()
        {
            var categorias = await _context.Categorias.ToListAsync();
            return Ok(categorias);
        }

        // GET: api/categorias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
                return NotFound();
            return Ok(categoria);
        }

        // POST: api/categorias
        [HttpPost]
        public async Task<IActionResult> CreateCategoria([FromBody] Categoria categoria)
        {
            if (categoria == null)
                return BadRequest("Payload nulo");
            if (string.IsNullOrWhiteSpace(categoria.Nome))
                return BadRequest("Nome da categoria é obrigatório.");
            if (categoria.CardapioId <= 0)
                return BadRequest("cardapioId é obrigatório e deve ser válido.");
            var cardapio = await _context.Cardapios.FindAsync(categoria.CardapioId);
            if (cardapio == null)
                return BadRequest($"Cardápio não encontrado para a categoria (cardapioId={categoria.CardapioId}).");
            var novaCategoria = new Categoria
            {
                Nome = categoria.Nome,
                CardapioId = categoria.CardapioId,
                Ativo = true,
                Ordem = categoria.Ordem,
                Icone = categoria.Icone,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };
            try
            {
                _context.Categorias.Add(novaCategoria);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCategoria), new { id = novaCategoria.Id }, novaCategoria);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao salvar categoria: {ex.Message}");
            }
        }

        // PUT: api/categorias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategoria(int id, [FromBody] Categoria categoria)
        {
            if (id != categoria.Id)
                return BadRequest();
            _context.Entry(categoria).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
                return NotFound();
            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/categorias/{categoriaId}/itens
        [HttpGet("{categoriaId}/itens")]
        public async Task<IActionResult> GetItensByCategoria(int categoriaId)
        {
            var itens = await _context.ItensCardapio.Where(i => i.CategoriaId == categoriaId).ToListAsync();
            return Ok(itens);
        }
    }
}
