using APICardapio.DTOs.Usuario;

namespace APICardapio.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioResponseDto>> GetAllAsync();
        Task<UsuarioResponseDto?> GetByIdAsync(int id);
        Task<UsuarioResponseDto> CreateAsync(UsuarioCreateDto usuarioDto);
        Task<UsuarioResponseDto?> UpdateAsync(int id, UsuarioUpdateDto usuarioDto);
        Task<UsuarioLoginResponseDto> LoginAsync(UsuarioLoginDto loginDto);
        Task<bool> DeleteAsync(int id);
    }
}
