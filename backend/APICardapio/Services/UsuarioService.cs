using APICardapio.DTOs.Usuario;
using APICardapio.Models;
using APICardapio.Repositories;

namespace APICardapio.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly JwtService _jwtService;

        public UsuarioService(IUsuarioRepository usuarioRepository, JwtService jwtService)
        {
            _usuarioRepository = usuarioRepository;
            _jwtService = jwtService;
        }

        public async Task<IEnumerable<UsuarioResponseDto>> GetAllAsync()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Select(MapToResponseDto);
        }

        public async Task<UsuarioResponseDto?> GetByIdAsync(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            return usuario != null ? MapToResponseDto(usuario) : null;
        }

        public async Task<UsuarioResponseDto> CreateAsync(UsuarioCreateDto usuarioDto)
        {
            // Verificar se email já existe
            if (await _usuarioRepository.EmailExistsAsync(usuarioDto.Email))
            {
                throw new InvalidOperationException("Email já está em uso por outro usuário.");
            }

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Email = usuarioDto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Senha), // Hash seguro da senha
                DataCriacao = DateTime.UtcNow,
                Ativo = true
            };

            var usuarioCriado = await _usuarioRepository.CreateAsync(usuario);
            return MapToResponseDto(usuarioCriado);
        }

        public async Task<UsuarioResponseDto?> UpdateAsync(int id, UsuarioUpdateDto usuarioDto)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null) return null;

            // Verificar se o novo email já existe (excluindo o usuário atual)
            if (await _usuarioRepository.EmailExistsAsync(usuarioDto.Email, id))
            {
                throw new InvalidOperationException("Email já está em uso por outro usuário.");
            }

            usuario.Nome = usuarioDto.Nome;
            usuario.Email = usuarioDto.Email;
            usuario.Ativo = usuarioDto.Ativo;

            var usuarioAtualizado = await _usuarioRepository.UpdateAsync(usuario);
            return MapToResponseDto(usuarioAtualizado);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _usuarioRepository.DeleteAsync(id);
        }

        private static UsuarioResponseDto MapToResponseDto(Usuario usuario)
        {
            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                DataCriacao = usuario.DataCriacao,
                Ativo = usuario.Ativo
            };
        }

        public async Task<UsuarioLoginResponseDto> LoginAsync(UsuarioLoginDto loginDto)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(loginDto.Email);
            if (usuario == null) 
            {
                throw new UnauthorizedAccessException("Email ou senha inválidos.");
            }

            if (!usuario.Ativo)
            {
                throw new UnauthorizedAccessException("Usuário inativo. Entre em contato com o administrador.");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Senha, usuario.SenhaHash))
            {
                throw new UnauthorizedAccessException("Email ou senha inválidos.");
            }

            var token = _jwtService.GenerateToken(usuario);

            return new UsuarioLoginResponseDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Token = token,
                
            };
        }
    }
}