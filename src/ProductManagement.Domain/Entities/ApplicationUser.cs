using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace ProductManagement.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public ICollection<Product> Products { get; set; }
}
