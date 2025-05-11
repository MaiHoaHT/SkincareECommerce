using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.CustomerSite.Services;
using SkincareWeb.ViewModels.Product;
using System.Text.Json;

public class ProductService : IProductService
{
	private readonly IHttpClientFactory _httpClientFactory;
	private readonly IHttpContextAccessor _httpContextAccessor;
	private readonly ILogger<CategoyService> _logger;

	public ProductService(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger<CategoyService> logger)
	{
		_httpClientFactory = httpClientFactory;
		_httpContextAccessor = httpContextAccessor;
		_logger = logger;
	}

	// Phương thức lấy HttpClient, tránh lặp lại code
	private async Task<HttpClient> GetHttpClientAsync()
	{
		var client = _httpClientFactory.CreateClient("BackendApi");

		// Lấy token từ HttpContext nếu có
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

	public async Task<List<ProductQuickViewModel>> GetAllProducts()
	{
		try
		{
			var client = await GetHttpClientAsync();
			_logger.LogInformation("Calling Product API endpoint");
			var response = await client.GetAsync("products");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				_logger.LogInformation($"Received Product data: {json}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
				};

				return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json, options);
			}
			else
			{
				_logger.LogError($"Failed to get product. Status code: {response.StatusCode}");
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting product");
		}

		return new List<ProductQuickViewModel>();
	}

	public async Task<ProductViewModel> GetProductDetails(int productId)
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var response = await client.GetAsync($"products/{productId}");

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<ProductViewModel>(json);
		}

		return null;
	}

	public async Task<List<ProductQuickViewModel>> GetProductsByCategoryId(int categoryId)
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var response = await client.GetAsync($"products/category/{categoryId}");

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json);
		}

		return new List<ProductQuickViewModel>();
	}

	public async Task<List<ProductQuickViewModel>> GetProductsByBrandId(int brandId)
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var response = await client.GetAsync($"products/brand/{brandId}");

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json);
		}

		return new List<ProductQuickViewModel>();
	}

	public async Task<List<ProductQuickViewModel>> GetProductsPaging(string filter, int? categoryId, int? brandId, int pageIndex, int pageSize)
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var url = $"products/filter?filter={filter}&categoryId={categoryId}&brandId={brandId}&pageIndex={pageIndex}&pageSize={pageSize}";
		var response = await client.GetAsync(url);

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json);
		}

		return new List<ProductQuickViewModel>();
	}
	public async Task<List<ProductQuickViewModel>> GetProductsIsFeature()
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var response = await client.GetAsync("products/feature");

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json);
		}

		return new List<ProductQuickViewModel>();
	}
	public async Task<List<ProductQuickViewModel>> GetProductsIsHot()
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var response = await client.GetAsync("products/hot");

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json);
		}

		return new List<ProductQuickViewModel>();
	}
	public async Task<List<ProductQuickViewModel>> GetProductIsHome()
	{
		var client = _httpClientFactory.CreateClient("BackendApi");
		var response = await client.GetAsync("products/home");

		if (response.IsSuccessStatusCode)
		{
			var json = await response.Content.ReadAsStringAsync();
			return JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json);
		}

		return new List<ProductQuickViewModel>();
	}
}
