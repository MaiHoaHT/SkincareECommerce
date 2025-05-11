using SkincareWeb.CustomerSite.Services.IServices;
using SkincareWeb.ViewModels.Cosmetics;
using System.Text.Json;

namespace SkincareWeb.CustomerSite.Services
{
	public class BrandService : IBrandService
	{
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly ILogger<CategoyService> _logger;
		public BrandService(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger<CategoyService> logger)
		{
			_httpClientFactory = httpClientFactory;
			_httpContextAccessor = httpContextAccessor;
			_logger = logger;
		}

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
		public async Task<List<BrandViewModel>> GetAllBrands()
		{
			try
			{
				var client = await GetHttpClientAsync();
				_logger.LogInformation("Calling brand API endpoint");
				var response = await client.GetAsync("brand");

				if (response.IsSuccessStatusCode)
				{
					var json = await response.Content.ReadAsStringAsync();
					_logger.LogInformation($"Received brand data: {json}");

					var options = new JsonSerializerOptions
					{
						PropertyNameCaseInsensitive = true,
						Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
					};

					return JsonSerializer.Deserialize<List<BrandViewModel>>(json, options);
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

			return new List<BrandViewModel>();
		}

		public Task<BrandViewModel> GetBrandById(int id)
		{
			throw new NotImplementedException();
		}
	}
}
