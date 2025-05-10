using SkincareWeb.ViewModels.Cosmetics;

namespace SkincareWeb.CustomerSite.Service.IService
{
    public interface ICategoryService
    {
        Task<List<CategoryViewModel>> GetAllCategories();
        Task<CategoryViewModel> GetCategoryById(int id);
    }
}
