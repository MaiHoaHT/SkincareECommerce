using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWeb.BackendServer.Controllers
{
    public class CapacityController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public CapacityController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả dung tích
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCapacities()
        {
            var capacities = await _context.Capacities.ToListAsync();
            return Ok(capacities);
        }

        // Lấy dung tích theo Id
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCapacityById(int id)
        {
            var capacity = await _context.Capacities.FindAsync(id);
            if (capacity == null)
            {
                return NotFound(new ApiNotFoundResponse($"Capacity with id: {id} is not found"));
            }
            return Ok(capacity);
        }

        // Tạo mới dung tích
        [HttpPost]
        public async Task<IActionResult> PostCapacity([FromBody] Capacity request)
        {
            var capacity = new Capacity
            {
                Value = request.Value
            };

            _context.Capacities.Add(capacity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetCapacityById), new { id = capacity.Id }, capacity);
            }
            return BadRequest(new ApiBadRequestResponse("Failed to create capacity"));
        }

        // Cập nhật dung tích
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCapacity(int id, [FromBody] Capacity request)
        {
            var capacity = await _context.Capacities.FindAsync(id);
            if (capacity == null)
            {
                return NotFound(new ApiNotFoundResponse($"Capacity with id: {id} is not found"));
            }

            capacity.Value = request.Value;
            _context.Capacities.Update(capacity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse("Failed to update capacity"));
        }

        // Xóa dung tích
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCapacity(int id)
        {
            var capacity = await _context.Capacities.FindAsync(id);
            if (capacity == null)
            {
                return NotFound(new ApiNotFoundResponse($"Capacity with id: {id} is not found"));
            }

            _context.Capacities.Remove(capacity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return Ok(new { Message = "Capacity deleted successfully" });
            }
            return BadRequest(new ApiBadRequestResponse("Failed to delete capacity"));
        }

        // Lấy danh sách dung tích sản phẩm theo ProductId
        [HttpGet("product/{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductCapacitiesByProductId(int productId)
        {
            var productCapacities = await _context.ProductCapacities
                .Where(pc => pc.ProductId == productId)
                .ToListAsync();

            if (!productCapacities.Any())
            {
                return NotFound(new ApiNotFoundResponse($"No capacities found for product id: {productId}"));
            }
            return Ok(productCapacities);
        }

        // Tạo mới dung tích sản phẩm
        [HttpPost("product/{productId}")]
        public async Task<IActionResult> PostProductCapacity(int productId, [FromBody] ProductCapacity request)
        {
            if (productId != request.ProductId)
            {
                return BadRequest(new ApiBadRequestResponse("ProductId mismatch"));
            }

            var productCapacity = new ProductCapacity
            {
                ProductId = request.ProductId,
                CapacityId = request.CapacityId,
                Price = request.Price,
                Quantity = request.Quantity
            };

            _context.ProductCapacities.Add(productCapacity);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetProductCapacitiesByProductId), new { productId = productCapacity.ProductId }, productCapacity);
            }
            return BadRequest(new ApiBadRequestResponse("Failed to create product capacity"));
        }
    }
}
