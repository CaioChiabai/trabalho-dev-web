using APICardapio.DTOs.Usuario;
using APICardapio.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace APICardapio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [SwaggerTag("Gerenciamento de usuários do sistema de cardápios digitais")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }        


        [HttpGet]
        [SwaggerOperation(
            Summary = "Listar todos os usuários",
            Description = "Retorna uma lista completa de todos os usuários ativos cadastrados no sistema",
            OperationId = "GetAllUsuarios"
        )]
        [SwaggerResponse(200, "Sucesso", typeof(IEnumerable<UsuarioResponseDto>))]
        [SwaggerResponse(500, "Erro interno do servidor", typeof(object))]
        [ProducesResponseType(typeof(IEnumerable<UsuarioResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetAll()
        {
            try
            {
                var usuarios = await _usuarioService.GetAllAsync();
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }        


        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Buscar usuário por ID",
            Description = "Retorna os dados completos de um usuário específico através do seu identificador único",
            OperationId = "GetUsuarioById"
        )]
        [SwaggerResponse(200, "Usuário encontrado", typeof(UsuarioResponseDto))]
        [SwaggerResponse(404, "Usuário não encontrado", typeof(object))]
        [SwaggerResponse(500, "Erro interno do servidor", typeof(object))]
        [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UsuarioResponseDto>> GetById(int id)
        {
            try
            {
                var usuario = await _usuarioService.GetByIdAsync(id);
                if (usuario == null)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }


        [HttpPost]
        [SwaggerOperation(
            Summary = "Criar novo usuário",
            Description = "Cria um novo usuário no sistema com validação de dados e regras de negócio",
            OperationId = "CreateUsuario"
        )]
        [SwaggerResponse(201, "Usuário criado com sucesso", typeof(UsuarioResponseDto))]
        [SwaggerResponse(400, "Dados inválidos ou email já existe", typeof(object))]
        [SwaggerResponse(500, "Erro interno do servidor", typeof(object))]
        [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        [Consumes("multipart/form-data", "application/json")]
        public async Task<ActionResult<UsuarioResponseDto>> Create([FromForm] UsuarioCreateDto usuarioDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var usuario = await _usuarioService.CreateAsync(usuarioDto);
                return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }


        [HttpPost("json")]
        [SwaggerOperation(
            Summary = "Criar novo usuário/restaurante (apenas JSON)",
            Description = "Cria um novo usuário/restaurante no sistema usando apenas dados JSON (sem arquivos)",
            OperationId = "CreateUsuarioJson"
        )]
        [SwaggerResponse(201, "Usuário criado com sucesso", typeof(UsuarioResponseDto))]
        [SwaggerResponse(400, "Dados inválidos ou email já existe", typeof(object))]
        [SwaggerResponse(500, "Erro interno do servidor", typeof(object))]
        [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UsuarioResponseDto>> CreateJson([FromBody] UsuarioCreateJsonDto usuarioDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createDto = new UsuarioCreateDto
                {
                    Nome = usuarioDto.Nome,
                    Email = usuarioDto.Email,
                    Cnpj = usuarioDto.Cnpj,
                    Telefone = usuarioDto.Telefone,
                    Senha = usuarioDto.Senha
                };

                var usuario = await _usuarioService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }


        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Atualizar usuário/restaurante",
            Description = "Atualiza os dados de um usuário/restaurante existente com validação de dados e regras de negócio. Aceita dados em multipart/form-data para upload de arquivos.",
            OperationId = "UpdateUsuario"
        )]
        [SwaggerResponse(200, "Usuário atualizado com sucesso", typeof(UsuarioResponseDto))]
        [SwaggerResponse(400, "Dados inválidos ou email já existe", typeof(object))]
        [SwaggerResponse(404, "Usuário não encontrado", typeof(object))]
        [SwaggerResponse(500, "Erro interno do servidor", typeof(object))]
        [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        [Consumes("multipart/form-data", "application/json")]
        public async Task<ActionResult<UsuarioResponseDto>> Update(int id, [FromForm] UsuarioUpdateDto usuarioDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var usuario = await _usuarioService.UpdateAsync(id, usuarioDto);
                if (usuario == null)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                return Ok(usuario);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }       


        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Remover usuário",
            Description = "Remove um usuário do sistema utilizando soft delete (preserva dados mas marca como inativo)",
            OperationId = "DeleteUsuario"
        )]
        [SwaggerResponse(204, "Usuário removido com sucesso")]
        [SwaggerResponse(404, "Usuário não encontrado", typeof(object))]
        [SwaggerResponse(500, "Erro interno do servidor", typeof(object))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _usuarioService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Usuário não encontrado" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }
    }
}
