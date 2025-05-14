using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using SkincareWeb.BackendServer.Controllers;
using SkincareWeb.BackendServer.Helpers;
using SkincareWeb.BackendServer.Services;
using SkincareWeb.ViewModels;
using SkincareWeb.ViewModels.Cosmetics;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;

namespace SkincareWeb.Tests.Controllers
{
    public class CategoriesControllerTests
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly Mock<ICacheService> _mockCacheService;
        private readonly CategoriesController _controller;

        public CategoriesControllerTests()
        {
            // Use in-memory database for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Use a unique database for each test
                .Options;
            _dbContext = new ApplicationDbContext(options);

            _mockCacheService = new Mock<ICacheService>();
            _controller = new CategoriesController(_dbContext, _mockCacheService.Object);

            // Set up a valid ControllerContext
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [Fact]
        public async Task GetCategories_ReturnsOkResult_WithCachedData()
        {
            // Arrange
            var cachedCategories = new List<CategoryViewModel>
                {
                    new CategoryViewModel { Id = 1, Name = "Category 1" },
                    new CategoryViewModel { Id = 2, Name = "Category 2" }
                };
            _mockCacheService.Setup(x => x.GetAsync<List<CategoryViewModel>>("Categories"))
                .ReturnsAsync(cachedCategories);

            // Act
            var result = await _controller.GetCategories();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<CategoryViewModel>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenCategoryDoesNotExist()
        {
            // Arrange
            var nonExistentCategoryId = 0;

            // Act
            var result = await _controller.GetById(nonExistentCategoryId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<ApiNotFoundResponse>(notFoundResult.Value);
            Assert.Equal($"Category with id: {nonExistentCategoryId} is not found", response.Message);
        }

        [Fact]
        public async Task PostCategory_ReturnsCreatedAtAction_WhenCategoryIsCreated()
        {
            // Arrange
            var categoryRequest = new CategoryViewModel
            {
                Name = "New Category",
                Banner = "banner.jpg",
                SeoAlias = "new-category",
                SeoDescription = "Description",
                SortOrder = 1,
                ParentId = null
            };

            // Simulate valid ModelState
            if (!_controller.ModelState.IsValid)
            {
                return; // This won't happen in this test since the model is valid
            }

            // Act
            var result = await _controller.PostCategory(categoryRequest);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(CategoriesController.GetById), createdResult.ActionName);
        }



        [Fact]
        public async Task DeleteCategory_ReturnsOkResult_WhenCategoryIsDeleted()
        {
            // Arrange
            var category = new Category
            {
                Id = 1,
                Name = "Category 1",
                Banner = "banner.jpg",
                SeoAlias = "category-1",
                SeoDescription = "Description for Category 1"
            };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteCategory(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CategoryViewModel>(okResult.Value);
            Assert.Equal(category.Id, returnValue.Id);
        }
        [Fact]
        public async Task PostCategory_ReturnsBadRequest_WhenModelIsInvalid()
        {
            // Arrange

            var invalidRequest = new CategoryViewModel
            {
                Id = 3,
                Name = "", // Invalid: Name is required
                Banner = "banner.jpg",
                SeoAlias = "invalid-category",
                SeoDescription = "Invalid Description",
                SortOrder = 1,
                ParentId = null
            };

            // Simulate invalid ModelState using validation messages from Messages.cs
            _controller.ModelState.AddModelError("Name", string.Format(Messages.Required, "Tên"));

            // Act
            var result = await _controller.PostCategory(invalidRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<ApiBadRequestResponse>(badRequestResult.Value);
            Assert.Contains(string.Format(Messages.Required, "Tên"), response.Errors);
        }
        [Fact]
        public async Task DeleteCategory_ReturnsNotFound_WhenCategoryDoesNotExist()
        {
            // Act
            var result = await _controller.DeleteCategory(1);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<ApiNotFoundResponse>(notFoundResult.Value);
            Assert.Equal("Category with id: 1 is not found", response.Message);
        }

        [Fact]
        public async Task PutCategory_ReturnsBadRequest_WhenCategoryIsChildOfItself()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Category 1",
                Banner = "banner.jpg",
                SeoAlias = "category-1",
                SeoDescription = "Description for Category 1"
            };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            var updateRequest = new CategoryCreateRequest
            {
                Name = "Updated Category",
                Banner = "updated-banner.jpg",
                SeoAlias = "updated-category",
                SeoDescription = "Updated Description",
                SortOrder = 2,
                ParentId = categoryId // Invalid: Category cannot be a child of itself
            };

            // Act
            var result = await _controller.PutCategory(categoryId, updateRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<ApiBadRequestResponse>(badRequestResult.Value);
            Assert.Equal("Category cannot be a child itself.", response.Message);
        }

        [Fact]
        public async Task PutCategory_ReturnsBadRequest_WhenUpdateFails()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Category 1",
                Banner = "banner.jpg",
                SeoAlias = "category-1",
                SeoDescription = "Description for Category 1"
            };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            var updateRequest = new CategoryCreateRequest
            {
                Name = "Updated Category",
                Banner = "updated-banner.jpg",
                SeoAlias = "updated-category",
                SeoDescription = "Updated Description",
                SortOrder = 2,
                ParentId = null
            };

            // Simulate a failure in saving changes
            _dbContext.Categories.Remove(category);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _controller.PutCategory(categoryId, updateRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<ApiBadRequestResponse>(badRequestResult.Value);
            Assert.Equal("Update category failed", response.Message);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsBadRequest_WhenDeleteFails()
        {
            // Arrange
            var categoryId = 1;
            var category = new Category
            {
                Id = categoryId,
                Name = "Category 1",
                Banner = "banner.jpg",
                SeoAlias = "category-1",
                SeoDescription = "Description for Category 1"
            };
            _dbContext.Categories.Add(category);
            await _dbContext.SaveChangesAsync();

            // Simulate a failure in saving changes
            _dbContext.Categories.Remove(category);
            await _dbContext.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteCategory(categoryId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<ApiBadRequestResponse>(badRequestResult.Value);
            Assert.Equal("Delete category failed", response.Message);
        }
    }
}
