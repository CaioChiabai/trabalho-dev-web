using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICardapio.Models;
using APICardapio.Data;

namespace APICardapio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItensCardapioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ItensCardapioController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/itenscardapio
        [HttpGet]
        public async Task<IActionResult> GetItens()
        {
            var itens = await _context.ItensCardapio.ToListAsync();
            return Ok(itens);
        }

        // GET: api/itenscardapio/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItem(int id)
        {
            var item = await _context.ItensCardapio.FindAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        // POST: api/itenscardapio
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemCardapio item)
        {
            if (item == null)
            {
                Console.WriteLine("Payload nulo recebido no POST /api/itenscardapio");
                return BadRequest();
            }
            // Garante que a categoria existe
            var categoria = await _context.Categorias.FindAsync(item.CategoriaId);
            if (categoria == null)
            {
                Console.WriteLine($"Categoria não encontrada para o item. CategoriaId: {item.CategoriaId}");
                return BadRequest("Categoria não encontrada para o item.");
            }
            try
            {
                _context.ItensCardapio.Add(item);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar item: {ex.Message}\nPayload: {System.Text.Json.JsonSerializer.Serialize(item)}");
                return StatusCode(500, $"Erro ao salvar item: {ex.Message}");
            }
        }

        // PUT: api/itenscardapio/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemCardapio item)
        {
            if (id != item.Id)
                return BadRequest();
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/itenscardapio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.ItensCardapio.FindAsync(id);
            if (item == null)
                return NotFound();
            _context.ItensCardapio.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
