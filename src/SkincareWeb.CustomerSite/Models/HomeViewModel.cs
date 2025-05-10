using SkincareWeb.ViewModels.Cosmetics;
using SkincareWeb.ViewModels.Product;

namespace SkincareWeb.CustomerSite.Models
{
	public class HomeViewModel
	{
		public List<ProductQuickViewModel> Products { get; set; } = new List<ProductQuickViewModel>();
		public List<ProductQuickViewModel> ProductsIsFeature { get; set; } = new List<ProductQuickViewModel>();
		public List<ProductQuickViewModel> ProductsIsHot { get; set; } = new List<ProductQuickViewModel>();
		public List<ProductQuickViewModel> ProductsIsHome { get; set; } = new List<ProductQuickViewModel>();
		public List<CategoryViewModel> Categories { get; set; } = new List<CategoryViewModel>();

	}
}
