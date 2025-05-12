using Microsoft.AspNetCore.Mvc;
using SkincareWeb.CustomerSite.Models;
using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.CustomerSite.Services.IServices;
using SkincareWeb.ViewModels.Cosmetics;
using SkincareWeb.ViewModels.Product;
using SkincareWeb.ViewModels.Ratings;

namespace SkincareWeb.CustomerSite.Controllers
{
	public class ProductsController : Controller
	{
		private readonly IProductService _productService;
		private readonly ICategoryService _categoryService;
		private readonly IBrandService _brandService;
		private readonly IRatingService _ratingService;
		public ProductsController(IProductService productService, ICategoryService categoryService, IBrandService brandService, IRatingService ratingService)
		{
			_productService = productService;
			_categoryService = categoryService;
			_brandService = brandService;
			_ratingService = ratingService;
		}
		public async Task<IActionResult> Index()
		{
			var data = await _productService.GetAllProducts();
			var categories = await _categoryService.GetAllCategories();
			var brands = await _brandService.GetAllBrands();
			var viewModel = new ProductPageViewModel
			{
				Products = data,
				Categories = categories,
				Brands = brands
			};
			return View(viewModel);
		}
		public async Task<IActionResult> ProductByCategoryId(int id)
		{
			var data = await _productService.GetAllProducts();
			var productByCategoryId = await _productService.GetProductsByCategoryId(id);
			var categories = await _categoryService.GetAllCategories();
			var viewModel = new ProductPageViewModel
			{
				Products = data,
				ProductsByCategory = productByCategoryId,
				Categories = categories
			};
			return View(viewModel);
		}
		public async Task<IActionResult> ProductDetails(int id)
		{
			try
			{
				var productDetail = await _productService.GetProductDetails(id);
				if (productDetail == null)
				{
					return View(new ProductDetailPageViewModel());
				}

				var category = await _categoryService.GetCategoryById(productDetail.CategoryId);
				if (category == null)
				{
					category = new CategoryViewModel { Name = "Unknown" };
				}

				var brand = await _brandService.GetBrandById(productDetail.BrandId);
				if (brand == null)
				{
					brand = new BrandViewModel { Title = "Unknown" };
				}

				var productRecommendByCategory = await _productService.GetProductsByCategoryId(productDetail.CategoryId);
				if (productRecommendByCategory == null)
				{
					productRecommendByCategory = new List<ProductQuickViewModel>();
				}

				var ratings = await _ratingService.GetRatingsByProduct(id.ToString());
				var averageRating = await _ratingService.GetAverageRating(id.ToString());

				var viewModel = new ProductDetailPageViewModel
				{
					ProductDetail = productDetail,
					ProductByBrand = brand,
					ProductCategory = category,
					ProductByCategory = productRecommendByCategory,
					Ratings = ratings,
					AverageRating = averageRating
				};
				return View(viewModel);
			}
			catch (Exception ex)
			{
				// Log the exception here
				return View(new ProductDetailPageViewModel());
			}
		}
		public async Task<IActionResult> FeaturedProducts()
		{
			var featuredProducts = await _productService.GetProductsIsFeature();
			var viewModel = new ProductPageViewModel
			{
				Products = featuredProducts,
				Categories = await _categoryService.GetAllCategories(),
				Brands = await _brandService.GetAllBrands()
			};
			return View("Index", viewModel);
		}

		public async Task<IActionResult> HotProducts()
		{
			var hotProducts = await _productService.GetProductsIsHot();
			var viewModel = new ProductPageViewModel
			{
				Products = hotProducts,
				Categories = await _categoryService.GetAllCategories(),
				Brands = await _brandService.GetAllBrands()
			};
			return View("Index", viewModel);
		}

		[HttpPost]
		public async Task<IActionResult> AddRating(RatingCreateRequest request)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var rating = await _ratingService.CreateRating(request);
				if (rating != null)
				{
					return RedirectToAction(nameof(ProductDetails), new { id = request.ProductId });
				}
				return BadRequest("Failed to create rating");
			}
			catch (Exception ex)
			{
				// Log the exception here
				return BadRequest("An error occurred while creating the rating");
			}
		}

		[HttpPost]
		public async Task<IActionResult> UpdateRating(int id, RatingCreateRequest request)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var rating = await _ratingService.UpdateRating(id, request);
				if (rating != null)
				{
					return RedirectToAction(nameof(ProductDetails), new { id = request.ProductId });
				}
				return BadRequest("Failed to update rating");
			}
			catch (Exception ex)
			{
				// Log the exception here
				return BadRequest("An error occurred while updating the rating");
			}
		}

		[HttpPost]
		public async Task<IActionResult> DeleteRating(int id, string productId)
		{
			try
			{
				var result = await _ratingService.DeleteRating(id);
				if (result)
				{
					return RedirectToAction(nameof(ProductDetails), new { id = productId });
				}
				return BadRequest("Failed to delete rating");
			}
			catch (Exception ex)
			{
				// Log the exception here
				return BadRequest("An error occurred while deleting the rating");
			}
		}

		[HttpGet]
		public async Task<IActionResult> Search(string searchTerm)
		{
			if (string.IsNullOrWhiteSpace(searchTerm))
			{
				return RedirectToAction(nameof(Index));
			}

			var searchResults = await _productService.SearchProducts(searchTerm);
			var categories = await _categoryService.GetAllCategories();
			var brands = await _brandService.GetAllBrands();

			var viewModel = new ProductPageViewModel
			{
				Products = searchResults,
				Categories = categories,
				Brands = brands,
				SearchTerm = searchTerm
			};

			return View("Index", viewModel);
		}

		[HttpGet]
		public async Task<IActionResult> Filter(int? categoryId, int? brandId, decimal? minPrice, decimal? maxPrice, string sortBy)
		{
			var filteredProducts = await _productService.GetAllProducts();
			var categories = await _categoryService.GetAllCategories();
			var brands = await _brandService.GetAllBrands();

			// Apply category filter
			if (categoryId.HasValue)
			{
				filteredProducts = filteredProducts.Where(p => p.CategoryId == categoryId.Value).ToList();
			}

			// Apply brand filter
			if (brandId.HasValue)
			{
				filteredProducts = filteredProducts.Where(p => p.BrandId == brandId.Value).ToList();
			}

			// Apply price range filter
			if (minPrice.HasValue)
			{
				filteredProducts = filteredProducts.Where(p => p.Price >= minPrice.Value).ToList();
			}
			if (maxPrice.HasValue)
			{
				filteredProducts = filteredProducts.Where(p => p.Price <= maxPrice.Value).ToList();
			}

			// Apply sorting
			if (!string.IsNullOrEmpty(sortBy))
			{
				switch (sortBy.ToLower())
				{
					case "price_asc":
						filteredProducts = filteredProducts.OrderBy(p => p.Price).ToList();
						break;
					case "price_desc":
						filteredProducts = filteredProducts.OrderByDescending(p => p.Price).ToList();
						break;
					case "name_asc":
						filteredProducts = filteredProducts.OrderBy(p => p.Name).ToList();
						break;
					case "name_desc":
						filteredProducts = filteredProducts.OrderByDescending(p => p.Name).ToList();
						break;
					default:
						break;
				}
			}

			var viewModel = new ProductPageViewModel
			{
				Products = filteredProducts,
				Categories = categories,
				Brands = brands,
				SelectedCategoryId = categoryId,
				SelectedBrandId = brandId,
				MinPrice = minPrice,
				MaxPrice = maxPrice,
				SortBy = sortBy
			};

			return View("Index", viewModel);
		}
	}
}
