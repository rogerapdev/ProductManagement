using Microsoft.AspNetCore.Http;
using ProductManagement.Application.DTOs;

namespace ProductManagement.Application.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllByUserIdAsync(string userId);
    Task<ProductDto> GetByIdAsync(Guid id, string userId);
    Task<ProductDto> CreateAsync(CreateProductDto dto, string userId);
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto, string userId);
    Task DeleteAsync(Guid id, string userId);
    Task<string> UploadImageAsync(IFormFile file);
    Task UpdateProductImageAsync(Guid id, IFormFile file, string userId);
}