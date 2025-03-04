using ProductManagement.Application.DTOs;
using ProductManagement.Application.DTOs.Auth;

namespace ProductManagement.Application.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
}
