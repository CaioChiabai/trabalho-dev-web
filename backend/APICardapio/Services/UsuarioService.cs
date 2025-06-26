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
                Cnpj = usuarioDto.Cnpj,
                Telefone = usuarioDto.Telefone,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Senha), // Em produção, use BCrypt ou similar
                Logo = usuarioDto.Logo != null ? await ConvertToByteArray(usuarioDto.Logo) : null,
                Banner = usuarioDto.Banner != null ? await ConvertToByteArray(usuarioDto.Banner) : null,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow,
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
            }            usuario.Nome = usuarioDto.Nome;
            usuario.Email = usuarioDto.Email;
            usuario.Ativo = usuarioDto.Ativo;
            usuario.DataAtualizacao = DateTime.UtcNow;

            // Atualizar CNPJ e Telefone se fornecidos
            if (!string.IsNullOrEmpty(usuarioDto.Cnpj))
            {
                usuario.Cnpj = usuarioDto.Cnpj;
            }
            
            if (!string.IsNullOrEmpty(usuarioDto.Telefone))
            {
                usuario.Telefone = usuarioDto.Telefone;
            }

            // Atualizar logo se fornecida
            if (usuarioDto.Logo != null)
            {
                usuario.Logo = await ConvertToByteArray(usuarioDto.Logo);
            }

            // Atualizar banner se fornecido
            if (usuarioDto.Banner != null)
            {
                usuario.Banner = await ConvertToByteArray(usuarioDto.Banner);
            }

            var usuarioAtualizado = await _usuarioRepository.UpdateAsync(usuario);
            return MapToResponseDto(usuarioAtualizado);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _usuarioRepository.DeleteAsync(id);
        }        private static UsuarioResponseDto MapToResponseDto(Usuario usuario)
        {
            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Cnpj = usuario.Cnpj,
                Telefone = usuario.Telefone,
                LogoUrl = usuario.Logo != null ? Convert.ToBase64String(usuario.Logo) : null,
                BannerUrl = usuario.Banner != null ? Convert.ToBase64String(usuario.Banner) : null,
                DataCriacao = usuario.DataCriacao,
                DataAtualizacao = usuario.DataAtualizacao,
                Ativo = usuario.Ativo
            };
        }

        private static async Task<byte[]> ConvertToByteArray(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        public async Task<UsuarioLoginResponseDto> LoginAsync(UsuarioLoginDto loginDto)
        {
            var usuario = await _usuarioRepository.GetByNomeAsync(loginDto.Nome);
            if (usuario == null) 
            {
                throw new UnauthorizedAccessException("Nome de usuário ou senha inválidos.");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Senha, usuario.SenhaHash))
            {
                throw new UnauthorizedAccessException("Nome de usuário ou senha inválidos.");
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