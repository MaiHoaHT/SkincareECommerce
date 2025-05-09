namespace SkincareWeb.ViewModels.Product
{
    public class ProductQuickViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string ImageUrl { get; set; }
        public bool IsHot { get; set; }
        public bool IsFeature { get; set; }
        public bool IsActive { get; set; }
    }
}
