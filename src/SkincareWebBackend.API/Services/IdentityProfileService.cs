using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.Identity;
using SkincareWebBackend.API.Data.Entities;
using System.Security.Claims;

namespace SkincareWeb.BackendServer.Services
{
    public class IdentityProfileService : IProfileService
    {
        private readonly UserManager<User> _userManager;
        public IdentityProfileService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var user = await _userManager.GetUserAsync(context.Subject);
            if (user != null)
            {
                var claims = new List<Claim>
            {
                new Claim("name", user.UserName),
                new Claim("email", user.Email),
            };

                context.IssuedClaims.AddRange(claims);
            }
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = true;
            return Task.CompletedTask;
        }
    }
}
