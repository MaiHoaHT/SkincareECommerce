using SkincareWeb.ViewModels.Cosmetics;
using SkincareWeb.ViewModels.Product;
using SkincareWeb.ViewModels.Ratings;

namespace SkincareWeb.CustomerSite.Models
{
	public class ProductDetailPageViewModel
	{
		public BrandViewModel ProductByBrand { get; set; }
		public CategoryViewModel ProductCategory { set; get; }
		public ProductViewModel ProductDetail { get; set; }

		public List<ProductQuickViewModel> ProductByCategory { get; set; }
		public List<RatingViewModel> Ratings { get; set; }
		public double AverageRating { get; set; }
	}
}
