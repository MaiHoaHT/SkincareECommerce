using SkincareWeb.ViewModels.Product;

namespace SkincareWeb.CustomerSite.Service.IService
{
    public interface IProductService
    {
        Task<List<ProductQuickViewModel>> GetAllProducts();
        Task<List<ProductQuickViewModel>> GetProductsByCategoryId(int categoryId);
        Task<List<ProductQuickViewModel>> GetProductsByBrandId(int brandId);
        Task<List<ProductQuickViewModel>> GetProductsIsFeature();
        Task<List<ProductQuickViewModel>> GetProductsIsHot();
        Task<List<ProductQuickViewModel>> GetProductIsHome();
        Task<ProductViewModel> GetProductDetails(int productId);
        Task<List<ProductQuickViewModel>> SearchProducts(string searchTerm);
    }
}
