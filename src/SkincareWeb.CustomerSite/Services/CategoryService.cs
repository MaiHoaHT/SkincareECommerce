using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.ViewModels.Cosmetics;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace SkincareWeb.CustomerSite.Services
{
	public class CategoryService : ICategoryService
	{
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly ILogger<CategoryService> _logger;

		public CategoryService(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger<CategoryService> logger)
		{
			_httpClientFactory = httpClientFactory;
			_httpContextAccessor = httpContextAccessor;
			_logger = logger;
		}

		// Phương thức lấy HttpClient, tránh lặp lại code
		private async Task<HttpClient> GetHttpClientAsync()
		{
			var client = _httpClientFactory.CreateClient("BackendApi");

			//// Lấy token từ HttpContext nếu có
			//var context = _httpContextAccessor.HttpContext;
			//if (context != null)
			//{
			//    var token = await context.GetTokenAsync("access_token");
			//    if (!string.IsNullOrEmpty(token))
			//    {
			//        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			//    }
			//}

			return client;
		}
		public async Task<List<CategoryViewModel>> GetAllCategories()
		{
			try
			{
				var client = await GetHttpClientAsync();
				_logger.LogInformation("Calling categories API endpoint");
				var response = await client.GetAsync("categories");

				if (response.IsSuccessStatusCode)
				{
					var json = await response.Content.ReadAsStringAsync();
					_logger.LogInformation($"Received categories data: {json}");

					var options = new JsonSerializerOptions
					{
						PropertyNameCaseInsensitive = true,
						Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
					};

					return JsonSerializer.Deserialize<List<CategoryViewModel>>(json, options);
				}
				else
				{
					_logger.LogError($"Failed to get categories. Status code: {response.StatusCode}");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting categories");
			}

			return new List<CategoryViewModel>();
		}

		public async Task<CategoryViewModel> GetCategoryById(int id)
		{
			try
			{
				var client = await GetHttpClientAsync();
				_logger.LogInformation($"Calling category API endpoint for category {id}");
				var response = await client.GetAsync($"categories/{id}");

				if (response.IsSuccessStatusCode)
				{
					var json = await response.Content.ReadAsStringAsync();
					_logger.LogInformation($"Received category data: {json}");

					var options = new JsonSerializerOptions
					{
						PropertyNameCaseInsensitive = true,
						Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
					};

					var category = JsonSerializer.Deserialize<CategoryViewModel>(json, options);
					if (category == null)
					{
						_logger.LogWarning($"Category {id} not found or invalid data format");
						return new CategoryViewModel { Id = id, Name = "Unknown" };
					}
					return category;
				}
				else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
				{
					_logger.LogWarning($"Category {id} not found");
					return new CategoryViewModel { Id = id, Name = "Unknown" };
				}
				else
				{
					_logger.LogError($"Failed to get category {id}. Status code: {response.StatusCode}");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, $"Error getting category {id}");
			}

			return new CategoryViewModel { Id = id, Name = "Unknown" };
		}
	}
}
