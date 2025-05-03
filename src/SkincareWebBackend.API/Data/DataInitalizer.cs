using Microsoft.AspNetCore.Identity;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWebBackend.API.Data
{
    public class DataInitalizer
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly string AdminRoleName = "Admin";
        private readonly string UserRoleName = "Member";

        public DataInitalizer(ApplicationDbContext context,
          UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task Seed()
        {
            #region Quyền

            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole
                {
                    Id = AdminRoleName,
                    Name = AdminRoleName,
                    NormalizedName = AdminRoleName.ToUpper(),
                });
                await _roleManager.CreateAsync(new IdentityRole
                {
                    Id = UserRoleName,
                    Name = UserRoleName,
                    NormalizedName = UserRoleName.ToUpper(),
                });
            }

            #endregion Quyền

            #region Người dùng

            if (!_userManager.Users.Any())
            {
                var result = await _userManager.CreateAsync(new User
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = "admin",
                    FirstName = "Quản trị viên",
                    LastName = "1",
                    Email = "htmaihoa792002@gmail.com",
                    LockoutEnabled = false
                }, "Admin@123");
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync("admin");
                    await _userManager.AddToRoleAsync(user, AdminRoleName);
                }
            }

            #endregion Người dùng

            #region Chức năng

            if (!_context.Functions.Any())
            {
                _context.Functions.AddRange(new List<Function>
                {
                    new Function { Id = "DASHBOARD", Name = "Thống kê", Url = "/dashboard", Icon = "fa-dashboard" },
                    new Function { Id = "PRODUCT", Name = "Sản phẩm", Url = "/products", Icon = "fa-product-hunt" },
                    new Function { Id = "CATEGORY", Name = "Danh mục", ParentId = "PRODUCT", Url = "/products/categories" },
                    new Function { Id = "BRAND", Name = "Thương hiệu", ParentId = "PRODUCT", Url = "/products/brands" },
                    new Function { Id = "ORDER", Name = "Đơn hàng", Url = "/orders", Icon = "fa-shopping-cart" },
                    new Function { Id = "CUSTOMER", Name = "Khách hàng", Url = "/customers", Icon = "fa-users" },
                    new Function { Id = "SYSTEM", Name = "Hệ thống", Url = "/system", Icon = "fa-cogs" },
                    new Function { Id = "USER", Name = "Tài khoản", ParentId = "SYSTEM", Url = "/system/users" },
                    new Function { Id = "ROLE", Name = "Phân quyền", ParentId = "SYSTEM", Url = "/system/roles" },
                    new Function {Id = "SYSTEM_FUNCTION", Name = "Chức năng",ParentId = "SYSTEM",Url = "/system/functions",Icon="fa-desktop"},
                    new Function {Id = "SYSTEM_PERMISSION", Name = "Quyền hạn",ParentId = "SYSTEM",Url = "/system/permissions",Icon="fa-desktop"},
                });
                await _context.SaveChangesAsync();
            }

            if (!_context.Commands.Any())
            {
                _context.Commands.AddRange(new List<Command>()
                {
                    new Command(){Id = "VIEW", Name = "Xem"},
                    new Command(){Id = "CREATE", Name = "Thêm"},
                    new Command(){Id = "UPDATE", Name = "Sửa"},
                    new Command(){Id = "DELETE", Name = "Xoá"},
                    new Command(){Id = "APPROVE", Name = "Duyệt"},
                });
            }

            #endregion Chức năng

            var functions = _context.Functions;

            if (!_context.CommandInFunctions.Any())
            {
                foreach (var function in functions)
                {
                    var createAction = new CommandInFunction()
                    {
                        CommandId = "CREATE",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(createAction);

                    var updateAction = new CommandInFunction()
                    {
                        CommandId = "UPDATE",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(updateAction);
                    var deleteAction = new CommandInFunction()
                    {
                        CommandId = "DELETE",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(deleteAction);

                    var viewAction = new CommandInFunction()
                    {
                        CommandId = "VIEW",
                        FunctionId = function.Id
                    };
                    _context.CommandInFunctions.Add(viewAction);
                }
            }

            if (!_context.Permissions.Any())
            {
                var adminRole = await _roleManager.FindByNameAsync(AdminRoleName);
                foreach (var function in functions)
                {
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "CREATE"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "UPDATE"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "DELETE"));
                    _context.Permissions.Add(new Permission(function.Id, adminRole.Id, "VIEW"));
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
