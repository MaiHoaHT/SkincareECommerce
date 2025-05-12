namespace SkincareWeb.ViewModels.Product
{
	public class ProductQuickViewModel
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public decimal Price { get; set; }
		public decimal Discount { get; set; }
		public string[] ImageUrls { get; set; }
		public int CategoryId { get; set; }
		public int BrandId { get; set; }
		public string CategoryName { get; set; }
		public string SeoAlias { get; set; }
		public string BrandName { get; set; }
		public bool IsHot { get; set; }
		public bool IsFeature { get; set; }
		public bool IsActive { get; set; }

	}
}
