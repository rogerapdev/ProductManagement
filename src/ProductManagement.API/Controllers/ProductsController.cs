using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Services.Interfaces;

namespace ProductManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var products = await _productService.GetAllByUserIdAsync(userId);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var product = await _productService.GetByIdAsync(id, userId);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateProductDto createProductDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (createProductDto.Image != null)
        {
            var fileName = await _productService.UploadImageAsync(createProductDto.Image);
            createProductDto.ImagePath = fileName;
        }
        var product = await _productService.CreateAsync(createProductDto, userId);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateProductDto updateProductDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (updateProductDto.Image != null)
        {
            var fileName = await _productService.UploadImageAsync(updateProductDto.Image);
            updateProductDto.ImagePath = fileName;
        }
        var product = await _productService.UpdateAsync(id, updateProductDto, userId);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _productService.DeleteAsync(id, userId);
        return NoContent();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        try
        {
            var filePath = await _productService.UploadImageAsync(file);
            return Ok(new { filePath });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadProductImage(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _productService.UpdateProductImageAsync(id, file, userId);
            return Ok(new { message = "Image uploaded successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}