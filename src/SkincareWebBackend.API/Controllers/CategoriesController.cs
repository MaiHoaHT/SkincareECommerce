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
    public class CategoriesController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;

        public CategoriesController(ApplicationDbContext context,
            ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        [HttpPost]
        public async Task<IActionResult> PostCategory([FromBody] CategoryCreateRequest request)
        {
            var category = new Category()
            {
                Name = request.Name,
                Banner = request.Banner,
                SeoAlias = request.SeoAlias,
                SeoDescription = request.SeoDescription,
                SortOrder = request.SortOrder,
                ParentId = request.ParentId,
            };
            _context.Categories.Add(category);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _cacheService.RemoveAsync("Categories");

                return CreatedAtAction(nameof(GetById), new { id = category.Id }, request);
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse("Create category failed"));
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategories()
        {
            var cachedData = await _cacheService.GetAsync<List<CategoryViewModel>>("Categories");
            if (cachedData == null)
            {
                var categorys = await _context.Categories.ToListAsync();

                var categoryVms = categorys.Select(c => CreateCategoryViewModel(c)).ToList();
                await _cacheService.SetAsync("Categories", categoryVms);
                cachedData = categoryVms;
            }

            return Ok(cachedData);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetCategoriesPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _context.Categories.AsQueryable();
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Name.Contains(filter)
                || x.Name.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            var data = items.Select(c => CreateCategoryViewModel(c)).ToList();

            var pagination = new Pagination<CategoryViewModel>
            {
                Items = data,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new ApiNotFoundResponse($"Category with id: {id} is not found"));

            CategoryViewModel categoryvm = CreateCategoryViewModel(category);

            return Ok(categoryvm);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromBody] CategoryCreateRequest request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new ApiNotFoundResponse($"Category with id: {id} is not found"));

            if (id == request.ParentId)
            {
                return BadRequest(new ApiBadRequestResponse("Category cannot be a child itself."));
            }

            category.Name = request.Name;
            category.ParentId = request.ParentId;
            category.SortOrder = request.SortOrder;
            category.SeoDescription = request.SeoDescription;
            category.SeoAlias = request.SeoAlias;

            _context.Categories.Update(category);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _cacheService.RemoveAsync("Categories");

                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse("Update category failed"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new ApiNotFoundResponse($"Category with id: {id} is not found"));

            _context.Categories.Remove(category);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                await _cacheService.RemoveAsync("Categories");

                CategoryViewModel categoryvm = CreateCategoryViewModel(category);
                return Ok(categoryvm);
            }
            return BadRequest();
        }

        private static CategoryViewModel CreateCategoryViewModel(Category category)
        {
            return new CategoryViewModel()
            {
                Id = category.Id,
                Name = category.Name,
                SortOrder = category.SortOrder,
                ParentId = category.ParentId,
                SeoDescription = category.SeoDescription,
                SeoAlias = category.SeoAlias
            };
        }
    }
}
