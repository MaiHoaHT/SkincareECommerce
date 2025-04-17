using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWebBackend.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IdentityRole>().Property(x => x.Id).HasMaxLength(50).IsUnicode(false);
            modelBuilder.Entity<User>().Property(x => x.Id).HasMaxLength(50).IsUnicode(false);

            modelBuilder.Entity<ProductCapacity>()
                        .HasKey(c => new { c.ProductId, c.CapacityId });

            modelBuilder.Entity<Permission>()
                       .HasKey(c => new { c.RoleId, c.FunctionId, c.CommandId });

            modelBuilder.Entity<ProductSkinType>()
                        .HasKey(c => new { c.ProductId, c.SkinTypeId });

            modelBuilder.Entity<CommandInFunction>()
                       .HasKey(c => new { c.CommandId, c.FunctionId });

            modelBuilder.HasSequence("ProductSequence");
        }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Capacity> Capacities { get; set; }
        public DbSet<Command> Commands { get; set; }
        public DbSet<CommandInFunction> CommandInFunctions { get; set; }
        public DbSet<Function> Functions { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCapacity> ProductCapacities { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductSkinType> ProductSkinTypes { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<SkinType> SkinTypes { get; set; }

    }
}
