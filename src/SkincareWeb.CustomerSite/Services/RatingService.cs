using SkincareWeb.CustomerSite.Services.IServices;
using SkincareWeb.ViewModels.Ratings;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace SkincareWeb.CustomerSite.Services
{
    public class RatingService : IRatingService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<RatingService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RatingService(
            IHttpClientFactory httpClientFactory, 
            ILogger<RatingService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        private async Task<HttpClient> GetHttpClientAsync()
        {
            var client = _httpClientFactory.CreateClient("BackendApi");
            
            // Get the access token from the current user's claims
            var accessToken = _httpContextAccessor.HttpContext?.User?.FindFirst("access_token")?.Value;
            if (!string.IsNullOrEmpty(accessToken))
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            }
            
            return client;
        }

        public async Task<List<RatingViewModel>> GetRatingsByProduct(string productId)
        {
            try
            {
                var client = await GetHttpClientAsync();
                _logger.LogInformation($"Getting ratings for product {productId}");
                var response = await client.GetAsync($"ratings/product/{productId}");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Received ratings data: {json}");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };

                    var ratings = JsonSerializer.Deserialize<List<RatingViewModel>>(json, options);
                    return ratings ?? new List<RatingViewModel>();
                }
                else
                {
                    _logger.LogError($"Failed to get ratings. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting ratings");
            }

            return new List<RatingViewModel>();
        }

        public async Task<RatingViewModel> CreateRating(RatingCreateRequest request)
        {
            try
            {
                var client = await GetHttpClientAsync();
                _logger.LogInformation($"Creating rating for product {request.ProductId}");
                
                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"ratings/product/{request.ProductId}", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Rating created successfully: {responseJson}");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };

                    return JsonSerializer.Deserialize<RatingViewModel>(responseJson, options);
                }
                else
                {
                    _logger.LogError($"Failed to create rating. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating rating");
            }

            return null;
        }

        public async Task<RatingViewModel> UpdateRating(int id, RatingCreateRequest request)
        {
            try
            {
                var client = await GetHttpClientAsync();
                _logger.LogInformation($"Updating rating {id}");
                
                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PutAsync($"ratings/{id}", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Rating updated successfully: {responseJson}");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };

                    return JsonSerializer.Deserialize<RatingViewModel>(responseJson, options);
                }
                else
                {
                    _logger.LogError($"Failed to update rating. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating rating");
            }

            return null;
        }

        public async Task<bool> DeleteRating(int id)
        {
            try
            {
                var client = await GetHttpClientAsync();
                _logger.LogInformation($"Deleting rating {id}");
                var response = await client.DeleteAsync($"ratings/{id}");

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Rating deleted successfully");
                    return true;
                }
                else
                {
                    _logger.LogError($"Failed to delete rating. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting rating");
            }

            return false;
        }

        public async Task<double> GetAverageRating(string productId)
        {
            try
            {
                var client = await GetHttpClientAsync();
                _logger.LogInformation($"Getting average rating for product {productId}");
                var response = await client.GetAsync($"ratings/product/{productId}/average");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Received average rating data: {json}");

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };

                    var result = JsonSerializer.Deserialize<dynamic>(json, options);
                    return result.AverageRating;
                }
                else
                {
                    _logger.LogError($"Failed to get average rating. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting average rating");
            }

            return 0;
        }
    }
} 