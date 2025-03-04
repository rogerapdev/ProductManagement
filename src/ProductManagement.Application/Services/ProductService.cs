using AutoMapper;
using Microsoft.AspNetCore.Http;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Services.Interfaces;
using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Repositories;
using ProductManagement.Infrastructure.Services;

namespace ProductManagement.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMapper _mapper;

    public ProductService(
        IProductRepository productRepository,
        IFileStorageService fileStorageService,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _fileStorageService = fileStorageService;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllByUserIdAsync(string userId)
    {
        var products = await _productRepository.GetAllByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto> GetByIdAsync(Guid id, string userId)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null || product.UserId != userId)
        {
            return null;
        }

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, string userId)
    {
        var product = _mapper.Map<Product>(dto);
        product.Id = Guid.NewGuid();
        product.UserId = userId;
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        var createdProduct = await _productRepository.AddAsync(product);
        return _mapper.Map<ProductDto>(createdProduct);
    }

    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto, string userId)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null || product.UserId != userId)
        {
            return null;
        }

        _mapper.Map(dto, product);
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task DeleteAsync(Guid id, string userId)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null || product.UserId != userId)
        {
            return;
        }

        if (!string.IsNullOrEmpty(product.ImagePath))
        {
            _fileStorageService.DeleteFile(product.ImagePath);
        }

        await _productRepository.DeleteAsync(id);
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        if (file == null) return "default-product.jpg";
        return await _fileStorageService.SaveFileAsync(file);
    }

    public async Task UpdateProductImageAsync(Guid id, IFormFile file, string userId)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null || product.UserId != userId)
        {
            throw new ApplicationException("Product not found or doesn't belong to the user");
        }

        // Delete old image if exists
        if (!string.IsNullOrEmpty(product.ImagePath))
        {
            _fileStorageService.DeleteFile(product.ImagePath);
        }

        // Save new image
        string fileName = await _fileStorageService.SaveFileAsync(file);
        product.ImagePath = fileName;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);
    }
}