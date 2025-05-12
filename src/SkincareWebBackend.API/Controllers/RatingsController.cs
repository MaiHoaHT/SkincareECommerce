using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.BackendServer.Services;
using SkincareWeb.ViewModels.Ratings;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;
using Microsoft.Extensions.Logging;

namespace SkincareWeb.BackendServer.Controllers
{
    public class RatingsController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly ICacheService _cacheService;
        private readonly ILogger<RatingsController> _logger;

        public RatingsController(
            ApplicationDbContext context, 
            ICacheService cacheService,
            ILogger<RatingsController> logger)
        {
            _context = context;
            _cacheService = cacheService;
            _logger = logger;
        }

        // Lấy tất cả đánh giá của một sản phẩm
        [HttpGet("product/{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRatingsByProduct(string productId)
        {
            try
            {
                var ratings = await _context.Ratings
                    .Where(r => r.ProductId == productId)
                    .ToListAsync();

                if (!ratings.Any())
                    return NotFound(new ApiNotFoundResponse($"No ratings found for product id: {productId}"));

                var ratingVms = ratings.Select(r => CreateRatingViewModel(r)).ToList();
                return Ok(ratingVms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting ratings for product {ProductId}", productId);
                return StatusCode(500, new ApiBadRequestResponse("An error occurred while retrieving ratings"));
            }
        }

        // Thêm đánh giá cho một sản phẩm
        [HttpPost("product/{productId}")]
        public async Task<IActionResult> PostRating(string productId, [FromBody] RatingCreateRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new ApiBadRequestResponse("Request body is required"));

                if (string.IsNullOrEmpty(request.UserId))
                    return BadRequest(new ApiBadRequestResponse("UserId is required"));

                if (string.IsNullOrEmpty(request.ProductId))
                    return BadRequest(new ApiBadRequestResponse("ProductId is required"));

                if (request.NumRate < 1 || request.NumRate > 5)
                    return BadRequest(new ApiBadRequestResponse("Rating must be between 1 and 5"));

                if (string.IsNullOrEmpty(request.Context))
                    return BadRequest(new ApiBadRequestResponse("Context is required"));

                if (productId != request.ProductId)
                    return BadRequest(new ApiBadRequestResponse("ProductId does not match"));

                // Check if user has already rated this product
                var existingRating = await _context.Ratings
                    .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.ProductId == productId);

                if (existingRating != null)
                    return BadRequest(new ApiBadRequestResponse("You have already rated this product"));

                var rating = new Rating()
                {
                    UserId = request.UserId,
                    ProductId = productId,
                    NumRate = request.NumRate,
                    Context = request.Context,
                    CreateDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now,
                };

                _context.Ratings.Add(rating);
                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    await _cacheService.RemoveAsync($"Ratings_Product_{productId}");
                    _logger.LogInformation("Rating created successfully for product {ProductId} by user {UserId}", productId, request.UserId);
                    return CreatedAtAction(nameof(GetRatingsByProduct), new { productId = productId }, CreateRatingViewModel(rating));
                }

                _logger.LogWarning("Failed to create rating for product {ProductId} by user {UserId}", productId, request.UserId);
                return BadRequest(new ApiBadRequestResponse("Failed to create rating"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating rating for product {ProductId} by user {UserId}", productId, request?.UserId);
                return StatusCode(500, new ApiBadRequestResponse("An error occurred while creating the rating"));
            }
        }

        // Tính trung bình đánh giá của một sản phẩm
        [HttpGet("product/{productId}/average")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAverageRating(string productId)
        {
            var ratings = await _context.Ratings.Where(r => r.ProductId == productId).ToListAsync();
            if (!ratings.Any())
                return NotFound(new ApiNotFoundResponse($"No ratings found for product id: {productId}"));

            var average = ratings.Average(r => r.NumRate);
            return Ok(new { ProductId = productId, AverageRating = average });
        }

        // Cập nhật đánh giá
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRating(int id, [FromBody] RatingCreateRequest request)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null)
                return NotFound(new ApiNotFoundResponse($"Rating with id: {id} is not found"));

            if (rating.ProductId != request.ProductId)
                return BadRequest(new ApiBadRequestResponse("Cannot update rating for a different product"));

            rating.NumRate = request.NumRate;
            rating.Context = request.Context;
            rating.LastModifiedDate = DateTime.Now;

            _context.Ratings.Update(rating);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _cacheService.RemoveAsync($"Ratings_Product_{rating.ProductId}");
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse("Failed to update rating"));
        }

        // Xóa đánh giá
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var rating = await _context.Ratings.FindAsync(id);
            if (rating == null)
                return NotFound(new ApiNotFoundResponse($"Rating with id: {id} is not found"));

            _context.Ratings.Remove(rating);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _cacheService.RemoveAsync($"Ratings_Product_{rating.ProductId}");
                return Ok(new { Message = "Rating deleted successfully" });
            }
            return BadRequest(new ApiBadRequestResponse("Failed to delete rating"));
        }

        // Helper method để tạo RatingViewModel
        private static RatingViewModel CreateRatingViewModel(Rating rating)
        {
            return new RatingViewModel()
            {
                Id = rating.Id,
                UserId = rating.UserId,
                ProductId = rating.ProductId,
                NumRate = rating.NumRate,
                Context = rating.Context,
                CreateDate = rating.CreateDate,
                LastModifiedDate = rating.LastModifiedDate
            };
        }
    }
}
