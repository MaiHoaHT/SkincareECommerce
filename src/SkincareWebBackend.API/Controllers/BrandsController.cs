using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.BackendServer.Services;
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
                var brandVms = brands.Select(b => CreateBrandViewModel(b)).ToList();
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
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound(new ApiNotFoundResponse($"Brand with id: {id} is not found"));

            _context.Brands.Remove(brand);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                await _cacheService.RemoveAsync("Brands");
                BrandViewModel brandVm = CreateBrandViewModel(brand);
                return Ok(brandVm);
            }
            return BadRequest();
        }

        private static BrandViewModel CreateBrandViewModel(Brand brand)
        {
            return new BrandViewModel()
            {
                Title = brand.Title,
                Description = brand.Description,
                Banner = brand.Banner,
                Alias = brand.Alias
            };
        }
    }
}
