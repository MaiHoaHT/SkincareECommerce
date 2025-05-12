using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.ViewModels;
using SkincareWeb.ViewModels.Product;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWeb.BackendServer.Controllers
{
    public class ProductsController : BaseController
    {
        private readonly ApplicationDbContext _context;
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // url get: http://localhost:7261/api/products
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts()
        {
            //var productQuickViewModel = await _context.Products
            //    .AsQueryable()
            //    .OrderByDescending(p => p.LastModifiedDate) // Sắp xếp theo ngày chỉnh sửa gần nhất
            //    .Select(p => new ProductQuickViewModel()
            //    {
            //        Id = p.Id,
            //        Name = p.Name,
            //        Price = p.Price,
            //        Discount = p.Discount,
            //        ImageUrl = p.ImageUrl,
            //        IsFeature = p.IsFeature,
            //        IsHot = p.IsHot,
            //        IsActive = p.IsActive
            //    })
            //    .ToListAsync();

            //return Ok(productQuickViewModel);
            // Lấy danh mục mặc định
            var productQuickViewModel = await _context.Products
                .GroupJoin(_context.Categories,
                    p => p.CategoryId,
                    c => c.Id,
                    (p, c) => new { p, c })
                .SelectMany(x => x.c.DefaultIfEmpty(), (x, c) => new { x.p, Category = c })
                .GroupJoin(_context.Brands,
                    pc => pc.p.BrandId,
                    b => b.Id,
                    (pc, b) => new { pc.p, pc.Category, b })
                .SelectMany(x => x.b.DefaultIfEmpty(), (x, b) => new { x.p, x.Category, Brand = b })
                .OrderByDescending(x => x.p.Id)
                .Select(x => new ProductQuickViewModel()
                {
                    Id = x.p.Id,
                    Name = x.p.Name,
                    Price = x.p.Price,
                    Discount = x.p.Discount,
                    ImageUrls = x.p.ImageUrls,
                    IsFeature = x.p.IsFeature,
                    IsHot = x.p.IsHot,
                    SeoAlias = x.p.SeoAlias,
                    IsActive = x.p.IsActive,
                    CategoryName = x.Category != null ? x.Category.Name : "Khác",
                    BrandName = x.Brand != null ? x.Brand.Title : "Khác",
                    CategoryId = x.p.CategoryId,
                    BrandId = x.p.BrandId
                })
                .ToListAsync();


            return Ok(productQuickViewModel);

        }
        [HttpGet("filter")]

        public async Task<IActionResult> GetProductsPaging(string filter, int? categoryId, int? brandId, int pageIndex, int pageSize)
        {
            var query = from p in _context.Products
                        join c in _context.Categories on p.CategoryId equals c.Id
                        join b in _context.Brands on p.BrandId equals b.Id
                        select new { p, c, b };

            if (!string.IsNullOrWhiteSpace(filter))
            {
                query = query.Where(x => x.p.Name.Contains(filter.Trim()));
            }
            if (categoryId.HasValue)
            {
                query = query.Where(x => x.p.CategoryId == categoryId.Value);
            }
            if (brandId.HasValue)
            {
                query = query.Where(x => x.p.BrandId == brandId.Value);
            }

            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new ProductQuickViewModel()
                {
                    Id = u.p.Id,
                    Price = u.p.Price,
                    Discount = u.p.Discount,
                    CategoryName = u.c.Name, // Lấy tên danh mục
                    BrandName = u.b.Title,    // Lấy tên thương hiệu
                    IsActive = u.p.IsActive,
                    IsFeature = u.p.IsFeature,
                    IsHot = u.p.IsHot
                })
                .ToListAsync();

            var pagination = new Pagination<ProductQuickViewModel>
            {
                PageSize = pageSize,
                PageIndex = pageIndex,
                Items = items,
                TotalRecords = totalRecords,
            };

            return Ok(pagination);
        }


        // url get: http://localhost:7261/api/products/1
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found product with id {id}"));

            var productViewModel = new ProductViewModel()
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Discount = product.Discount,
                ImageUrls = product.ImageUrls,
                CategoryId = product.CategoryId,
                BrandId = product.BrandId,
                SeoAlias = product.SeoAlias,
                Quantity = product.Quantity,
                Sold = product.Sold,
                Status = product.Status,
                IsFeature = product.IsFeature,
                IsHome = product.IsHome,
                IsHot = product.IsHot,
                IsActive = product.IsActive,
                CreateDate = product.CreateDate,
                LastModifiedDate = product.LastModifiedDate
            };
            return Ok(productViewModel);
        }
        // GET: api/product/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsByCategoryId(int categoryId)
        {
            var products = _context.Products.Where(x => x.CategoryId == categoryId);

            // using a quick view model to reduce the amount of data sent to the client
            var productQuickView = await products.Select(p => new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                ImageUrls = p.ImageUrls,
                IsFeature = p.IsFeature,
                BrandId = p.BrandId,
                CategoryId = p.CategoryId,
                SeoAlias = p.SeoAlias,
                IsHot = p.IsHot,
                IsActive = p.IsActive
            }).ToListAsync();

            return Ok(productQuickView);
        }

        // GET: api/product/brand/{brandId}
        [HttpGet("brand/{brandId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsByBrandId(int brandId)
        {
            // Filter products by BrandId
            var products = _context.Products.Where(x => x.BrandId == brandId);

            // Use ProductQuickViewModel to reduce data payload sent to client
            var productQuickView = await products.Select(p => new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                ImageUrls = p.ImageUrls,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                SeoAlias = p.SeoAlias,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot,
                IsActive = p.IsActive
            }).ToListAsync();

            return Ok(productQuickView);
        }
        // GET: api/product/hot
        [HttpGet("hot")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsIsHot()
        {
            // Filter products by BrandId
            var products = _context.Products.Where(x => x.IsHot == true);

            // Use ProductQuickViewModel to reduce data payload sent to client
            var productQuickView = await products.Select(p => new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                ImageUrls = p.ImageUrls,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                SeoAlias = p.SeoAlias,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot,
                IsActive = p.IsActive
            }).ToListAsync();

            return Ok(productQuickView);
        }

        // GET: api/product/home
        [HttpGet("home")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsIsHome()
        {
            // Filter products by BrandId
            var products = _context.Products.Where(x => x.IsHome == true);

            // Use ProductQuickViewModel to reduce data payload sent to client
            var productQuickView = await products.Select(p => new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                ImageUrls = p.ImageUrls,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                SeoAlias = p.SeoAlias,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot,
                IsActive = p.IsActive
            }).ToListAsync();

            return Ok(productQuickView);
        }

        // GET: api/product/home
        [HttpGet("feature")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsIsFeature()
        {
            // Filter products by BrandId
            var products = _context.Products.Where(x => x.IsFeature == true);

            // Use ProductQuickViewModel to reduce data payload sent to client
            var productQuickView = await products.Select(p => new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                SeoAlias = p.SeoAlias,
                ImageUrls = p.ImageUrls,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot,
                IsActive = p.IsActive
            }).ToListAsync();

            return Ok(productQuickView);
        }
        // url post: http://localhost:7261/api/products
        [HttpPost]
        public async Task<IActionResult> PostProduct([FromBody] ProductCreateRequest request)
        {

            var products = await _context.Products.FindAsync(request.Id);
            if (products != null)
                return BadRequest(new ApiBadRequestResponse($"Product with id {request.Id} is existed."));

            var product = new Product()
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Discount = request.Discount,
                ImageUrls = request.ImageUrls,
                CategoryId = request.CategoryId,
                BrandId = request.BrandId,
                SeoAlias = request.SeoAlias,
                Quantity = request.Quantity,
                Sold = request.Sold,
                Status = request.Status,
                IsFeature = request.IsFeature,
                IsHome = request.IsHome,
                IsHot = request.IsHot,
                IsActive = request.IsActive,
                CreateDate = request.CreateDate,
                LastModifiedDate = request.LastModifiedDate
            };
            _context.Products.Add(product);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, request);
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse("Create product is failed"));
            }
        }

        // url put: http://localhost:7261/api/products/1
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] ProductCreateRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { Message = $"Product with ID {id} not found." });
            }
            // Lấy danh mục mặc định
            var defaultCategory = await _context.Categories
                .Where(c => c.Name == "Khác")
                .FirstOrDefaultAsync();

            // Lấy thương hiệu mặc định
            var defaultBrand = await _context.Brands
                .Where(b => b.Title == "Khác")
                .FirstOrDefaultAsync();

            // Update product details
            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Discount = request.Discount;
            product.ImageUrls = request.ImageUrls;
            if (request.CategoryId == null)
            {
                request.CategoryId = defaultCategory.Id;
            }
            if (request.BrandId == null)
            {
                request.BrandId = defaultBrand.Id;
            }
            product.SeoAlias = request.SeoAlias;
            product.Quantity = request.Quantity;
            product.Sold = request.Sold;
            product.Status = request.Status;
            product.IsFeature = request.IsFeature;
            product.IsHome = request.IsHome;
            product.IsHot = request.IsHot;
            product.IsActive = request.IsActive;
            product.LastModifiedDate = DateTime.Now;

            _context.Products.Update(product);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent(); // Update successful
            }

            return BadRequest(new ApiBadRequestResponse("Update product fail"));
        }


        // url delete: http://localhost:7261/api/products/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new ApiNotFoundResponse($"Cannot found product with id {id}"));
            }

            // Remove product
            _context.Products.Remove(product);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                var productQuickViewModel = new ProductQuickViewModel()
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Discount = product.Discount,
                    ImageUrls = product.ImageUrls,
                    IsFeature = product.IsFeature,
                    BrandId = product.BrandId,
                    CategoryId = product.CategoryId,
                    SeoAlias = product.SeoAlias,

                    IsHot = product.IsHot,
                    IsActive = product.IsActive
                };
                return Ok(productQuickViewModel);
                // return Ok(new { Message = $"Product with ID {id} has been deleted successfully." });
            }

            return BadRequest(new ApiBadRequestResponse("Fail to delete product"));
        }
        private static ProductQuickViewModel CreateProductQuickViewModel(Product p)
        {
            return new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                ImageUrls = p.ImageUrls,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot,
                SeoAlias = p.SeoAlias,
                BrandId = p.BrandId,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId
            };
        }
    }
}

