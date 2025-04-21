using Microsoft.AspNetCore.Mvc;

namespace SkincareWeb.BackendServer.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
