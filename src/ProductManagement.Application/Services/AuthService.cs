using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.DTOs.Auth;
using ProductManagement.Application.Services.Interfaces;
using ProductManagement.Domain.Entities;

namespace ProductManagement.Application.Services;

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        ILogger<AuthService> logger,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _logger = logger;
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            // Verificar se o email já existe
            var existingUserByEmail = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUserByEmail != null)
            {
                _logger.LogWarning($"Registration failed: Email {registerDto.Email} already exists");
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email already exists.",
                    ErrorDetails = new List<string> { "This email is already registered in our system." }
                };
            }

            // Verificar se o nome de usuário já existe
            var existingUserByName = await _userManager.FindByNameAsync(registerDto.UserName);
            if (existingUserByName != null)
            {
                _logger.LogWarning($"Registration failed: Username {registerDto.UserName} already exists");
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Username already exists.",
                    ErrorDetails = new List<string> { "This username is already taken." }
                };
            }

            // Criar o novo usuário
            var user = new ApplicationUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                // Outros campos conforme necessário
            };

            _logger.LogInformation($"Attempting to create user: {registerDto.UserName}, {registerDto.Email}");
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                // Capturar todos os erros específicos
                var errorMessages = result.Errors.Select(e => e.Description).ToList();
                var errorDetails = string.Join(", ", errorMessages);

                _logger.LogError($"User creation failed for {registerDto.Email}. Errors: {errorDetails}");

                return new AuthResponseDto
                {
                    Success = false,
                    Message = "User creation failed!",
                    ErrorDetails = errorMessages
                };
            }

            _logger.LogInformation($"User created successfully: {registerDto.UserName}, {registerDto.Email}");

            // Adicionar roles ou outras configurações conforme necessário

            return new AuthResponseDto
            {
                Success = true,
                Message = "User registered successfully!"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Unexpected error during registration: {ex.Message}");
            _logger.LogError($"Stack trace: {ex.StackTrace}");

            return new AuthResponseDto
            {
                Success = false,
                Message = "An unexpected error occurred during registration.",
                ErrorDetails = new List<string> { "Server error. Please try again later." }
            };
        }
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Invalid credentials"
            };
        }

        var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        return new AuthResponseDto
        {
            Success = true,
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            UserId = user.Id,
            Email = user.Email,
            UserName = user.UserName
        };
    }

}
