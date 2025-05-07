using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.ViewModels.Product;
using SkincareWeb.ViewModels.Systems;
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
        public async Task<IActionResult> GetProducts()
        {
            var productQuickViewModel = await _context.Products.AsQueryable().Select(p => new ProductQuickViewModel()
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                ImageUrl = p.ImageUrl,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot,
            }).ToListAsync();
            return Ok(productQuickViewModel);
        }
        [HttpGet("filter")]
        public async Task<IActionResult> GetProductsPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Products.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Name.Contains(filter)
                || x.Description.Contains(filter) || x.SeoAlias.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            var data = items.Select(c => CreateProductQuickViewModel(c)).ToList();

            var pagination = new Pagination<ProductQuickViewModel>
            {
                Items = data,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        // url get: http://localhost:7261/api/products/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found product with id {id}"));

            var productViewModel = new ProductViewModel()
            {
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Discount = product.Discount,
                ImageUrl = product.ImageUrl,
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
                ImageUrl = p.ImageUrl,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot
            }).ToListAsync();

            return Ok(productQuickView);
        }

        // GET: api/product/brand/{brandId}
        [HttpGet("brand/{brandId}")]
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
                ImageUrl = p.ImageUrl,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot
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
                ImageUrl = request.ImageUrl,
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

            // Update product details
            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Discount = request.Discount;
            product.ImageUrl = request.ImageUrl;
            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;
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
                    ImageUrl = product.ImageUrl,
                    IsFeature = product.IsFeature,
                    IsHot = product.IsHot
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
                ImageUrl = p.ImageUrl,
                IsFeature = p.IsFeature,
                IsHot = p.IsHot
            };
        }
    }
}

