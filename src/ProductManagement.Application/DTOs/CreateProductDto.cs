using Microsoft.AspNetCore.Http;

namespace ProductManagement.Application.DTOs;

public class CreateProductDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public IFormFile? Image { get; set; }
    public string ImagePath { get; set; } = "default-product.jpg"; // Valor padrão
}
