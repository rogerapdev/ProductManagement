
using Microsoft.Extensions.DependencyInjection;
using ProductManagement.Application.Mapping;
using ProductManagement.Application.Services;
using ProductManagement.Application.Services.Interfaces;

namespace ProductManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));

        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}