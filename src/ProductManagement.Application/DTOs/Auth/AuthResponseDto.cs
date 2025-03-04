namespace ProductManagement.Application.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; }
    public string UserId { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; }

    public List<string> ErrorDetails { get; set; } = new List<string>();
}
