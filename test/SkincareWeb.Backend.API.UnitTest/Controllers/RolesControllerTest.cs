using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MockQueryable;
using Moq;
using SkincareWeb.Backend.API.UnitTest.Helpers;
using SkincareWeb.ViewModels.Systems;
using SkincareWebBackend.API.Controllers;
using SkincareWebBackend.API.Data;



public class RolesControllerTests
{
    private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;
    private ApplicationDbContext _context;

    private List<IdentityRole> _roleSources = new List<IdentityRole>(){
                             new IdentityRole("test1"),
                             new IdentityRole("test2"),
                             new IdentityRole("test3"),
                             new IdentityRole("test4")
                        };

    public RolesControllerTests()
    {
        var roleStore = new Mock<IRoleStore<IdentityRole>>();
        _mockRoleManager = new Mock<RoleManager<IdentityRole>>(roleStore.Object, null, null, null, null);

        _context = new InMemoryDbContextFactory().GetApplicationDbContext();
    }

    [Fact]
    public void ShouldCreateInstance_NotNull_Success()
    {
        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        Assert.NotNull(rolesController);
    }



    [Fact]
    public async Task GetRoles_HasData_ReturnSuccess()
    {
        // Giả lập danh sách vai trò
        var mockQueryableRoles = _roleSources.AsQueryable().BuildMock();

        _mockRoleManager.Setup(x => x.Roles).Returns(mockQueryableRoles);

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.GetRoles();

        // Kiểm tra kết quả trả về có hợp lệ không
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var roleVms = okResult.Value as IEnumerable<RoleViewModel>;
        Assert.NotNull(roleVms);
        Assert.True(roleVms.Any()); // Kiểm tra có phần tử nào hay không
    }
    [Fact]
    public async Task GetRoles_ThrowException_Failed()
    {
        _mockRoleManager.Setup(x => x.Roles).Throws<Exception>();

        var rolesController = new RolesController(_mockRoleManager.Object, _context);

        await Assert.ThrowsAnyAsync<Exception>(async () => await rolesController.GetRoles());
    }

    [Fact]
    public async Task GetRolesPaging_NoFilter_ReturnSuccess()
    {
        // Giả lập danh sách vai trò
        var mockQueryableRoles = _roleSources.AsQueryable().BuildMock();

        _mockRoleManager.Setup(x => x.Roles).Returns(mockQueryableRoles);

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.GetRolesPaging(null, 1, 2);

        // Kiểm tra kết quả trả về có hợp lệ không
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var roleVms = okResult.Value as Pagination<RoleViewModel>;
        Assert.NotNull(roleVms);
        Assert.Equal(4, roleVms.TotalRecords);
        Assert.Equal(2, roleVms.Items.Count);
    }
    [Fact]
    public async Task GetRolesPaging_HasFilter_ReturnSuccess()
    {
        // Giả lập danh sách vai trò
        var mockQueryableRoles = _roleSources.AsQueryable().BuildMock();

        _mockRoleManager.Setup(x => x.Roles).Returns(mockQueryableRoles);

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.GetRolesPaging("test3", 1, 2);

        // Kiểm tra kết quả trả về có hợp lệ không
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var roleVms = okResult.Value as Pagination<RoleViewModel>;
        Assert.NotNull(roleVms);
        Assert.Equal(1, roleVms.TotalRecords);
        Assert.Single(roleVms.Items);
    }

    [Fact]
    public async Task GetRolesPaging_ThrowException_Failed()
    {
        _mockRoleManager.Setup(x => x.Roles).Throws<Exception>();

        var rolesController = new RolesController(_mockRoleManager.Object, _context);

        await Assert.ThrowsAnyAsync<Exception>(async () => await rolesController.GetRolesPaging(null, 1, 1));
    }

    [Fact]
    public async Task GetById_HasData_ReturnSuccess()
    {
        _mockRoleManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new IdentityRole()
            {
                Id = "test1",
                Name = "test1"
            });
        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.GetById("test1");
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        var roleVm = okResult.Value as RoleViewModel;

        Assert.Equal("test1", roleVm.Name);
    }

    [Fact]
    public async Task GetById_ThrowException_Failed()
    {
        _mockRoleManager.Setup(x => x.FindByIdAsync(It.IsAny<string>())).Throws<Exception>();

        var rolesController = new RolesController(_mockRoleManager.Object, _context);

        await Assert.ThrowsAnyAsync<Exception>(async () => await rolesController.GetById("test1"));
    }


    [Fact]
    public async Task DeleteRole_ValidInput_Success()
    {
        _mockRoleManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
           .ReturnsAsync(new IdentityRole()
           {
               Id = "test",
               Name = "test"
           });

        _mockRoleManager.Setup(x => x.DeleteAsync(It.IsAny<IdentityRole>()))
            .ReturnsAsync(IdentityResult.Success);
        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.DeleteRole("test");
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task DeleteRole_ValidInput_Failed()
    {
        _mockRoleManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
         .ReturnsAsync(new IdentityRole()
         {
             Id = "test",
             Name = "test"
         });

        _mockRoleManager.Setup(x => x.DeleteAsync(It.IsAny<IdentityRole>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError[] { }));

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.DeleteRole("test");
        Assert.IsType<BadRequestObjectResult>(result);
    }
    [Fact]
    public async Task PostRole_ValidInput_Failed()
    {
        _mockRoleManager.Setup(x => x.CreateAsync(It.IsAny<IdentityRole>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError[] { new IdentityError { Code = "Error", Description = "Failed to create role." } }));

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.PostRole(new RoleViewModel { Id = "test", Name = "test" });

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequestResult.Value);
    }
    [Fact]
    public async Task PutRole_NotFound_Failed()
    {
        _mockRoleManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((IdentityRole)null);

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.PutRole("test", new RoleViewModel { Id = "test", Name = "updatedName" });

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task PutRole_ValidInput_Failed()
    {
        _mockRoleManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new IdentityRole() { Id = "test", Name = "oldName" });

        _mockRoleManager.Setup(x => x.UpdateAsync(It.IsAny<IdentityRole>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError[] { new IdentityError { Code = "Error", Description = "Failed to update role." } }));

        var rolesController = new RolesController(_mockRoleManager.Object, _context);
        var result = await rolesController.PutRole("test", new RoleViewModel { Id = "test", Name = "updatedName" });

        Assert.IsType<BadRequestObjectResult>(result);
    }

}
