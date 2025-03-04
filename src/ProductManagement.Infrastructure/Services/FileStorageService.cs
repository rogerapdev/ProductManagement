using Microsoft.AspNetCore.Http;

namespace ProductManagement.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly string _uploadsFolder;

    public FileStorageService(string uploadsFolder = null)
    {
        // Se não for fornecido um caminho específico, usa um padrão no diretório atual
        _uploadsFolder = uploadsFolder ?? Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        if (!Directory.Exists(_uploadsFolder))
        {
            Directory.CreateDirectory(_uploadsFolder);
        }
    }

    public async Task<string> SaveFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return null;
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
        {
            throw new ArgumentException("Only .jpg, .jpeg and .png files are allowed");
        }

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(_uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return fileName;
    }

    public void DeleteFile(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            return;
        }

        var filePath = Path.Combine(_uploadsFolder, fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file);
    void DeleteFile(string fileName);
}