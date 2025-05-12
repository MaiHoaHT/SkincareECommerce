using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.CustomerSite.Services;
using SkincareWeb.ViewModels.Product;
using System.Text.Json;

public class ProductService : IProductService
{
	private readonly IHttpClientFactory _httpClientFactory;
	private readonly IHttpContextAccessor _httpContextAccessor;
	private readonly ILogger<CategoryService> _logger;

	public ProductService(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, ILogger<CategoryService> logger)
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
		try
		{
			var client = await GetHttpClientAsync();
			_logger.LogInformation($"Calling Product API endpoint for product {productId}");
			var response = await client.GetAsync($"products/{productId}");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				_logger.LogInformation($"Received product detail data: {json}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
				};

				var product = JsonSerializer.Deserialize<ProductViewModel>(json, options);
				if (product == null)
				{
					_logger.LogWarning($"Product {productId} not found or invalid data format");
				}
				return product;
			}
			else
			{
				_logger.LogError($"Failed to get product {productId}. Status code: {response.StatusCode}");
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting product {productId}");
		}

		return null;
	}

	public async Task<List<ProductQuickViewModel>> GetProductsByCategoryId(int categoryId)
	{
		try
		{
			var client = await GetHttpClientAsync();
			_logger.LogInformation($"Calling Product API endpoint for category {categoryId}");
			var response = await client.GetAsync($"products/category/{categoryId}");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				_logger.LogInformation($"Received products by category data: {json}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
				};

				var products = JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json, options);
				if (products == null)
				{
					_logger.LogWarning($"No products found for category {categoryId}");
					return new List<ProductQuickViewModel>();
				}
				return products;
			}
			else
			{
				_logger.LogError($"Failed to get products for category {categoryId}. Status code: {response.StatusCode}");
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"Error getting products for category {categoryId}");
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
		try
		{
			var client = await GetHttpClientAsync();
			_logger.LogInformation("Calling Product API endpoint for featured products");
			var response = await client.GetAsync("products/feature");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				_logger.LogInformation($"Received featured products data: {json}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
				};

				var products = JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json, options);
				if (products == null)
				{
					_logger.LogWarning("No featured products found");
					return new List<ProductQuickViewModel>();
				}
				return products;
			}
			else
			{
				_logger.LogError($"Failed to get featured products. Status code: {response.StatusCode}");
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting featured products");
		}

		return new List<ProductQuickViewModel>();
	}
	public async Task<List<ProductQuickViewModel>> GetProductsIsHot()
	{
		try
		{
			var client = await GetHttpClientAsync();
			_logger.LogInformation("Calling Product API endpoint for hot products");
			var response = await client.GetAsync("products/hot");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				_logger.LogInformation($"Received hot products data: {json}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
				};

				var products = JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json, options);
				if (products == null)
				{
					_logger.LogWarning("No hot products found");
					return new List<ProductQuickViewModel>();
				}
				return products;
			}
			else
			{
				_logger.LogError($"Failed to get hot products. Status code: {response.StatusCode}");
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting hot products");
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

	public async Task<List<ProductQuickViewModel>> SearchProducts(string searchTerm)
	{
		try
		{
			var client = await GetHttpClientAsync();
			_logger.LogInformation($"Searching products with term: {searchTerm}");
			var response = await client.GetAsync($"products/search?searchTerm={Uri.EscapeDataString(searchTerm)}");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				_logger.LogInformation($"Received search results: {json}");

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
					Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
				};

				var products = JsonSerializer.Deserialize<List<ProductQuickViewModel>>(json, options);
				return products ?? new List<ProductQuickViewModel>();
			}
			else
			{
				_logger.LogError($"Failed to search products. Status code: {response.StatusCode}");
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error searching products");
		}

		return new List<ProductQuickViewModel>();
	}
}
