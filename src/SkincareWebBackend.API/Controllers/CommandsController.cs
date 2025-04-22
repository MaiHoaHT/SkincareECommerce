using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.ViewModels.Systems;
using SkincareWebBackend.API.Data;

namespace SkincareWeb.BackendServer.Controllers
{
    public class CommandsController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public CommandsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCommands()
        {
            var user = User.Identity.Name;
            var commands = _context.Commands;

            var commandVms = await commands.Select(u => new CommandViewModel()
            {
                Id = u.Id,
                Name = u.Name,
            }).ToListAsync();

            return Ok(commandVms);
        }
    }
}
