using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Controllers;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.ViewModels.Systems;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWebBackend.API.Controllers
{
    public class RolesController : BaseController
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        public RolesController(RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }

        // url post: http://localhost:7261/api/roles
        [HttpPost]
        public async Task<IActionResult> PostRole(RoleCreateRequest request)
        {
            var role = new IdentityRole()
            {
                Id = request.Id,
                Name = request.Name,
                NormalizedName = request.Name.ToUpper()
            };
            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetById), new { Id = role.Id }, request);
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
        public async Task<IActionResult> PutRole(string id, [FromBody] RoleCreateRequest request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            role.Name = request.Name;
            role.NormalizedName = request.Name.ToUpper();

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

        // PERMISSION 
        [HttpGet("{roleId}/permissions")]
        public async Task<IActionResult> GetPermissionByRoleId(string roleId)
        {
            var permissions = from p in _context.Permissions

                              join a in _context.Commands
            on p.CommandId equals a.Id
                              where p.RoleId == roleId
                              select new PermissionViewModel()
                              {
                                  FunctionId = p.FunctionId,
                                  CommandId = p.CommandId,
                                  RoleId = p.RoleId
                              };

            return Ok(await permissions.ToListAsync());
        }

        [HttpPut("{roleId}/permissions")]
        public async Task<IActionResult> PutPermissionByRoleId(string roleId, [FromBody] UpdatePermissionRequest request)
        {
            //create new permission list from user changed
            var newPermissions = new List<Permission>();
            foreach (var p in request.Permissions)
            {
                newPermissions.Add(new Permission(p.FunctionId, roleId, p.CommandId));
            }
            var existingPermissions = _context.Permissions.Where(x => x.RoleId == roleId);

            _context.Permissions.RemoveRange(existingPermissions);
            _context.Permissions.AddRange(newPermissions.Distinct(new MyPermissionComparer()));
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return NoContent();
            }

            return BadRequest(new ApiBadRequestResponse("Save permission failed"));
        }
    }
    /// <summary>
    /// Custom comparer for Permission objects to check equality based on CommandId, FunctionId, and RoleId.
    /// </summary>
    internal class MyPermissionComparer : IEqualityComparer<Permission>
    {
        /// <summary>
        /// Determines whether two Permission objects are equal by comparing their CommandId, FunctionId, and RoleId.
        /// </summary>
        /// <param name="x">The first Permission object.</param>
        /// <param name="y">The second Permission object.</param>
        /// <returns>True if both objects have the same values, otherwise false.</returns>
        public bool Equals(Permission x, Permission y)
        {
            // Check if both objects reference the same instance
            if (ReferenceEquals(x, y)) return true;

            // Check if either object is null
            if (x is null || y is null) return false;

            // Compare CommandId, FunctionId, and RoleId to determine equality
            return x.CommandId == y.CommandId && x.FunctionId == y.FunctionId && x.RoleId == y.RoleId;
        }

        /// <summary>
        /// Generates a hash code for a Permission object using its CommandId, FunctionId, and RoleId.
        /// </summary>
        /// <param name="permission">The Permission object.</param>
        /// <returns>A unique hash code.</returns>
        public int GetHashCode(Permission permission)
        {
            // Return 0 if the object is null to prevent errors
            if (permission is null) return 0;

            // Compute hash codes for each property and combine them using XOR
            int hashCommandId = permission.CommandId.GetHashCode();
            int hashFunctionId = permission.FunctionId.GetHashCode();
            int hashRoleId = permission.RoleId.GetHashCode();

            return hashCommandId ^ hashFunctionId ^ hashRoleId; // XOR ensures efficient hash distribution
        }
    }

}
