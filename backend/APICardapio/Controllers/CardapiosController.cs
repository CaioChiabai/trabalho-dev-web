using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APICardapio.Models;
using APICardapio.Data;

namespace APICardapio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardapiosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CardapiosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCardapios()
        {
            var cardapios = await _context.Cardapios
                .Include(c => c.Categorias)
                .ToListAsync();
            return Ok(cardapios);
        }

        [HttpGet("usuario/{usuarioId:int}")]
        public async Task<IActionResult> GetCardapiosByUsuario(int usuarioId)
        {
            var cardapios = await _context.Cardapios
                .Include(c => c.Categorias)
                .Where(c => c.UsuarioId == usuarioId)
                .ToListAsync();
            return Ok(cardapios);
        }

        [HttpGet("publico/{id:int}")]
        public async Task<IActionResult> GetCardapioPublico(int id)
        {
            var cardapio = await _context.Cardapios
                .Include(c => c.Categorias)
                    .ThenInclude(cat => cat.ItensCardapio)
                .FirstOrDefaultAsync(c => c.Id == id);
                
            if (cardapio == null)
                return NotFound(new { message = "Cardápio não encontrado" });
                
            return Ok(cardapio);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCardapio(int id)
        {
            var cardapio = await _context.Cardapios.FindAsync(id);
            if (cardapio == null)
                return NotFound();
            return Ok(cardapio);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCardapio([FromBody] Cardapio cardapio)
        {
            if (cardapio == null)
                return BadRequest("Payload nulo");
            if (string.IsNullOrWhiteSpace(cardapio.Nome))
                return BadRequest("Nome do cardápio é obrigatório.");
            if (cardapio.UsuarioId <= 0)
                return BadRequest("usuarioId é obrigatório e deve ser válido.");
            // Garante que o usuário existe
            var usuario = await _context.Usuarios.FindAsync(cardapio.UsuarioId);
            if (usuario == null)
                return BadRequest($"Usuário não encontrado para o cardápio (usuarioId={cardapio.UsuarioId}).");
            try
            {
                _context.Cardapios.Add(cardapio);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCardapio), new { id = cardapio.Id }, cardapio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao salvar cardápio: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCardapio(int id, [FromBody] Cardapio cardapio)
        {
            if (id != cardapio.Id)
                return BadRequest();
            _context.Entry(cardapio).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCardapio(int id)
        {
            var cardapio = await _context.Cardapios.FindAsync(id);
            if (cardapio == null)
                return NotFound();
            _context.Cardapios.Remove(cardapio);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{cardapioId}/categorias")]
        public async Task<IActionResult> GetCategoriasByCardapio(int cardapioId)
        {
            var categorias = await _context.Categorias.Where(c => c.CardapioId == cardapioId).ToListAsync();
            return Ok(categorias);
        }
    }
}
