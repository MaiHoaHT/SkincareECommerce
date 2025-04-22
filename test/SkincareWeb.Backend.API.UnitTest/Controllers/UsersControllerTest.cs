
using global::SkincareWebBackend.API.Controllers;
using global::SkincareWebBackend.API.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SkincareWeb.ViewModels.Systems;

namespace SkincareWebBackend.Tests.Controllers
{
    public class UsersControllerTests
    {
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            _controller = new UsersController(_mockUserManager.Object, null);
        }

        [Fact]
        public async Task PostUser_ShouldReturnCreatedAtAction_WhenUserIsCreated()
        {
            // Arrange
            var request = new UserCreateRequest
            {
                Email = "test@example.com",
                Dob = "2000-01-01",
                UserName = "testuser",
                FirstName = "Test",
                LastName = "User",
                PhoneNumber = "123456789"
            };

            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.PostUser(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_controller.GetById), createdResult.ActionName);
        }

        [Fact]
        public async Task PostUser_ShouldReturnBadRequest_WhenUserCreationFails()
        {
            // Arrange
            var request = new UserCreateRequest
            {
                Email = "test@example.com",
                Dob = "2000-01-01",
                UserName = "testuser",
                FirstName = "Test",
                LastName = "User",
                PhoneNumber = "123456789"
            };

            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Error" }));

            // Act
            var result = await _controller.PostUser(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task GetById_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var userId = "123";
            var user = new User
            {
                Id = userId,
                UserName = "testuser",
                Email = "test@example.com",
                Dob = DateTime.Parse("2000-01-01"),
                FirstName = "Test",
                LastName = "User",
                PhoneNumber = "123456789",
                CreateDate = DateTime.Now
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync(user);

            // Act
            var result = await _controller.GetById(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var userViewModel = Assert.IsType<UserViewModel>(okResult.Value);
            Assert.Equal(userId, userViewModel.Id);
        }

        [Fact]
        public async Task GetById_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = "123";

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync((User)null);

            // Act
            var result = await _controller.GetById(userId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
        [Fact]
        public async Task PutUser_ShouldReturnNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange
            var userId = "123";
            var request = new UserCreateRequest
            {
                FirstName = "UpdatedFirstName",
                LastName = "UpdatedLastName",
                Dob = "1990-01-01"
            };

            var user = new User
            {
                Id = userId,
                FirstName = "OldFirstName",
                LastName = "OldLastName",
                Dob = DateTime.Parse("1980-01-01")
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.PutUser(userId, request);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(request.FirstName, user.FirstName);
            Assert.Equal(request.LastName, user.LastName);
            Assert.Equal(DateTime.Parse(request.Dob), user.Dob);
        }

        [Fact]
        public async Task PutUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = "123";
            var request = new UserCreateRequest
            {
                FirstName = "UpdatedFirstName",
                LastName = "UpdatedLastName",
                Dob = "1990-01-01"
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync((User)null);

            // Act
            var result = await _controller.PutUser(userId, request);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PutUser_ShouldReturnBadRequest_WhenUpdateFails()
        {
            // Arrange
            var userId = "123";
            var request = new UserCreateRequest
            {
                FirstName = "UpdatedFirstName",
                LastName = "UpdatedLastName",
                Dob = "1990-01-01"
            };

            var user = new User
            {
                Id = userId,
                FirstName = "OldFirstName",
                LastName = "OldLastName",
                Dob = DateTime.Parse("1980-01-01")
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Update failed" }));

            // Act
            var result = await _controller.PutUser(userId, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnOk_WhenUserIsDeleted()
        {
            // Arrange
            var userId = "123";
            var user = new User
            {
                Id = userId,
                UserName = "testuser",
                Email = "test@example.com"
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync(user);

            _mockUserManager.Setup(x => x.DeleteAsync(user))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.DeleteUser(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var userViewModel = Assert.IsType<UserViewModel>(okResult.Value);
            Assert.Equal(userId, userViewModel.Id);
        }

        [Fact]
        public async Task DeleteUser_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = "123";

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync((User)null);

            // Act
            var result = await _controller.DeleteUser(userId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
        [Fact]
        public async Task PutUser_ShouldUpdateUser_WhenInputIsValid()
        {
            // Arrange
            var userId = "123";
            var request = new UserCreateRequest
            {
                FirstName = "ValidFirstName",
                LastName = "ValidLastName",
                Dob = "1995-05-15"
            };

            var existingUser = new User
            {
                Id = userId,
                FirstName = "OldFirstName",
                LastName = "OldLastName",
                Dob = DateTime.Parse("1980-01-01"),
                LastModifiedDate = DateTime.MinValue
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.PutUser(userId, request);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(request.FirstName, existingUser.FirstName);
            Assert.Equal(request.LastName, existingUser.LastName);
            Assert.Equal(DateTime.Parse(request.Dob), existingUser.Dob);
            Assert.True(existingUser.LastModifiedDate > DateTime.MinValue); // Ensure LastModifiedDate is updated
        }
        [Fact]
        public async Task PutUser_ShouldReturnBadRequest_WhenInputViolatesValidationRules()
        {
            // Arrange
            var userId = "123";
            var request = new UserCreateRequest
            {
                UserName = "", // Invalid: UserName is required
                Password = "123", // Invalid: Password does not meet complexity rules
                Email = "invalid-email", // Invalid: Email format is incorrect
                PhoneNumber = "", // Invalid: PhoneNumber is required
                FirstName = "ThisFirstNameIsWayTooLongToBeValidBecauseItExceedsFiftyCharacters", // Invalid: Exceeds max length
                LastName = "" // Invalid: LastName is required
            };

            var existingUser = new User
            {
                Id = userId,
                FirstName = "OldFirstName",
                LastName = "OldLastName",
                Dob = DateTime.Parse("1980-01-01"),
                LastModifiedDate = DateTime.MinValue
            };

            _mockUserManager.Setup(x => x.FindByIdAsync(userId))
                .ReturnsAsync(existingUser);

            // Add FluentValidation errors to ModelState
            var validator = new UserCreateRequestValidation();
            var validationResult = validator.Validate(request);
            foreach (var error in validationResult.Errors)
            {
                _controller.ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }

            // Act
            var result = await _controller.PutUser(userId, request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);

            // Optionally, check specific validation error messages
            var errors = badRequestResult.Value as SerializableError;
            Assert.Contains("UserName", errors.Keys);
            Assert.Contains("Password", errors.Keys);
            Assert.Contains("Email", errors.Keys);
            Assert.Contains("PhoneNumber", errors.Keys);
            Assert.Contains("FirstName", errors.Keys);
            Assert.Contains("LastName", errors.Keys);
        }


    }
}

