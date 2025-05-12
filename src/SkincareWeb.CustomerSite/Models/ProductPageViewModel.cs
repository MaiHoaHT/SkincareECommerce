using SkincareWeb.ViewModels.Cosmetics;
using SkincareWeb.ViewModels.Product;

namespace SkincareWeb.CustomerSite.Models
{
	public class ProductPageViewModel
	{
		public List<ProductQuickViewModel> Products { get; set; } = new List<ProductQuickViewModel>();
		public List<ProductQuickViewModel> ProductsByCategory { get; set; } = new List<ProductQuickViewModel>();
		public List<CategoryViewModel> Categories { get; set; } = new List<CategoryViewModel>();
		public List<BrandViewModel> Brands { get; set; } = new List<BrandViewModel>();
		
		// Search and filter properties
		public string SearchTerm { get; set; }
		public int? SelectedCategoryId { get; set; }
		public int? SelectedBrandId { get; set; }
		public decimal? MinPrice { get; set; }
		public decimal? MaxPrice { get; set; }
		public string SortBy { get; set; }
	}
}
