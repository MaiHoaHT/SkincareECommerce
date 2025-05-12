using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.BackendServer.Services;
using SkincareWeb.ViewModels;
using SkincareWeb.ViewModels.Cosmetics;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWeb.BackendServer.Controllers
{
    public class BrandController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public BrandController(ApplicationDbContext context,
            ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        [HttpPost]
        public async Task<IActionResult> PostBrand([FromBody] BrandViewModel request)
        {
            var brand = new Brand()
            {
                Title = request.Title,
                Description = request.Description,
                Banner = request.Banner,
                Alias = request.Alias,
            };
            _context.Brands.Add(brand);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _cacheService.RemoveAsync("Brands");
                return CreatedAtAction(nameof(GetById), new { id = brand.Id }, request);
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse("Create brand failed"));
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetBrands()
        {
            var cachedData = await _cacheService.GetAsync<List<BrandViewModel>>("Brands");
            if (cachedData == null)
            {
                var brands = await _context.Brands.ToListAsync();
                var brandVms = brands.OrderByDescending(b => b.Id).Select(b => CreateBrandViewModel(b)).ToList();
                await _cacheService.SetAsync("Brands", brandVms);
                cachedData = brandVms;
            }

            return Ok(cachedData);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound(new ApiNotFoundResponse($"Brand with id: {id} is not found"));

            BrandViewModel brandVm = CreateBrandViewModel(brand);
            return Ok(brandVm);
        }
        [HttpGet("filter")]
        public async Task<IActionResult> GetBrandsPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Brands.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Title.Contains(filter)
                || x.Alias.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            var data = items.Select(c => CreateBrandViewModel(c)).ToList();

            var pagination = new Pagination<BrandViewModel>
            {
                Items = data,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, [FromBody] BrandViewModel request)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound(new ApiNotFoundResponse($"Brand with id: {id} is not found"));

            brand.Title = request.Title;
            brand.Description = request.Description;
            brand.Banner = request.Banner;
            brand.Alias = request.Alias;

            _context.Brands.Update(brand);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _cacheService.RemoveAsync("Brands");
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse("Update brand failed"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            //var brand = await _context.Brands.FindAsync(id);
            //if (brand == null)
            //    return NotFound(new ApiNotFoundResponse($"Brand with id: {id} is not found"));

            //_context.Brands.Remove(brand);
            //var result = await _context.SaveChangesAsync();
            //if (result > 0)
            //{
            //    await _cacheService.RemoveAsync("Brands");
            //    BrandViewModel brandVm = CreateBrandViewModel(brand);
            //    return Ok(brandVm);
            //}
            //return BadRequest();
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var products = _context.Products.Where(p => p.BrandId == id).ToList();
                    _context.Products.RemoveRange(products);

                    // Lưu thay đổi vào database sau khi xóa sản phẩm
                    await _context.SaveChangesAsync();

                    var brand = await _context.Brands.FindAsync(id);
                    if (brand == null)
                        return NotFound(new ApiNotFoundResponse($"Brand with id: {id} is not found"));

                    _context.Brands.Remove(brand);
                    var result = await _context.SaveChangesAsync();

                    if (result > 0)
                    {
                        await transaction.CommitAsync();
                        await _cacheService.RemoveAsync("Brands");
                        BrandViewModel brandVm = CreateBrandViewModel(brand);
                        return Ok(brandVm);
                    }

                    await transaction.RollbackAsync();
                    return BadRequest();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Ghi log lỗi ở đây
                    return StatusCode(500, "An error occurred while deleting the brand and products.");
                }
            }

        }

        private static BrandViewModel CreateBrandViewModel(Brand brand)
        {
            return new BrandViewModel()
            {
                Id = brand.Id,
                Title = brand.Title,
                Description = brand.Description,
                Banner = brand.Banner,
                Alias = brand.Alias
            };
        }
    }
}
