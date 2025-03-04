using ProductManagement.Domain.Entities;

namespace ProductManagement.Domain.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllByUserIdAsync(string userId);
    Task<Product> GetByIdAsync(Guid id);
    Task<Product> AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> BelongsToUserAsync(Guid id, string userId);
}
