using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.ViewModels.Systems;

namespace SkincareWebBackend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        public RolesController(RoleManager<IdentityRole> roleManager, Data.ApplicationDbContext _context)
        {
            _roleManager = roleManager;
        }

        // url post: http://localhost:7261/api/roles
        [HttpPost]
        public async Task<IActionResult> PostRole(RoleViewModel roleViewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var role = new IdentityRole()
            {
                Id = roleViewModel.Id,
                Name = roleViewModel.Name,
                NormalizedName = roleViewModel.Name.ToUpper()
            };
            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetById), new { Id = role.Id }, roleViewModel);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        //url get: http://localhost:7261/api/roles/
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleManager.Roles.Select(r => new RoleViewModel()
            {
                Id = r.Id,
                Name = r.Name
            }).ToListAsync();
            return Ok(roles);
        }

        // URL: GET: http://localhost:5001/api/roles?filter={filter}&pageIndex=1&pageSize=10
        [HttpGet("filter")]
        public async Task<IActionResult> GetRolesPaging(string filter, int pageIndex, int pageSize)
        {
            var query = _roleManager.Roles;
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Id.Contains(filter) || x.Name.Contains(filter));
            }

            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(r => new RoleViewModel()
                                   {
                                       Id = r.Id,
                                       Name = r.Name
                                   })
                                   .ToListAsync();

            var pagination = new Pagination<RoleViewModel>
            {
                Items = items,
                TotalRecords = totalRecords,
            };

            return Ok(pagination);
        }

        //url get: http://localhost:7261/api/roles/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            var roleViewModel = new RoleViewModel()
            {
                Id = role.Id,
                Name = role.Name
            };
            return Ok(roleViewModel);
        }

        //url put: http://localhost:7261/api/roles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(string id, [FromBody] RoleViewModel roleViewModel)
        {
            if (id != roleViewModel.Id)
            {
                return BadRequest();
            }
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            role.Name = roleViewModel.Name;
            role.NormalizedName = roleViewModel.Name.ToUpper();

            var result = await _roleManager.UpdateAsync(role);
            if (result.Succeeded) { return NoContent(); }
            return BadRequest(result.Errors);
        }

        //url delete: http://localhost:7261/api/roles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                var roleVm = new RoleViewModel()
                {
                    Id = role.Id,
                    Name = role.Name
                };
                return Ok(roleVm);
            }
            return BadRequest(result.Errors);
        }

    }
}
