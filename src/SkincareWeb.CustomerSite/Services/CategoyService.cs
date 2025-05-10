using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.ViewModels.Cosmetics;
using System.Text.Json;

namespace SkincareWeb.CustomerSite.Services
{
    public class CategoyService : ICategoryService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CategoyService(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor)
        {
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
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
            var client = await GetHttpClientAsync();
            var response = await client.GetAsync("categories");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<CategoryViewModel>>(json);
            }

            return new List<CategoryViewModel>();
        }

        public async Task<CategoryViewModel> GetCategoryById(int id)
        {
            var client = await GetHttpClientAsync();
            var response = await client.GetAsync($"categories/{id}");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<CategoryViewModel>(json);
            }

            return null;
        }
    }
}
