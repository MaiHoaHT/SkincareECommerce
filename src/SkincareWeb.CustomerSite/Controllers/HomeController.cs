using Microsoft.AspNetCore.Mvc;
using SkincareWeb.CustomerSite.Models;
using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.CustomerSite.Services.IServices;
using System.Diagnostics;

namespace SkincareWeb.CustomerSite.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private readonly IProductService _productService;
		private readonly ICategoryService _categoryService;
		private readonly IBrandService _brandService;
		public HomeController(ILogger<HomeController> logger,
			IProductService productService,
			ICategoryService categoryService,
			IBrandService brandService)
		{
			_logger = logger;
			_productService = productService;
			_categoryService = categoryService;
			_brandService = brandService;
		}

		public async Task<IActionResult> Index()
		{
			var products = await _productService.GetAllProducts();
			var categories = await _categoryService.GetAllCategories();
			var productsIsFeature = await _productService.GetProductsIsFeature();
			var productsIsHot = await _productService.GetProductsIsHot();
			var productsIsHome = await _productService.GetProductIsHome();
			var brandItems = await _brandService.GetAllBrands();
			var viewModel = new HomeViewModel
			{
				Products = products,
				Categories = categories,
				ProductsIsFeature = productsIsFeature,
				ProductsIsHot = productsIsHot,
				ProductsIsHome = productsIsHome,
				Brands = brandItems
			};
			return View(viewModel);
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
