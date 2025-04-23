namespace SkincareWeb.ViewModels.Product
{
    public class ProductViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public string SeoAlias { get; set; }
        public int Quantity { get; set; }
        public int Sold { get; set; }
        public bool Status { get; set; } = false;
        public bool IsFeature { get; set; } = false;
        public bool IsHome { get; set; } = false;
        public bool IsHot { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}
