using SkincareWeb.ViewModels.Cosmetics;

namespace SkincareWeb.CustomerSite.Services.IServices
{
	public interface IBrandService
	{
		Task<List<BrandViewModel>> GetAllBrands();
		Task<BrandViewModel> GetBrandById(int id);
	}
}
