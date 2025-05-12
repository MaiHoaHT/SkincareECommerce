using SkincareWeb.ViewModels.Ratings;

namespace SkincareWeb.CustomerSite.Services.IServices
{
    public interface IRatingService
    {
        Task<List<RatingViewModel>> GetRatingsByProduct(string productId);
        Task<RatingViewModel> CreateRating(RatingCreateRequest request);
        Task<RatingViewModel> UpdateRating(int id, RatingCreateRequest request);
        Task<bool> DeleteRating(int id);
        Task<double> GetAverageRating(string productId);
    }
} 