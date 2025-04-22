using Duende.IdentityServer;
using Duende.IdentityServer.Models;

namespace SkincareWebBackend.IdentityServer
{
    public class IdentityServerConfig
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
            [
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            ];

        public static IEnumerable<ApiResource> ApiResources =>
            [
                new ApiResource("api.skincare", "Skincare API")
            ];

        public static IEnumerable<ApiScope> ApiScopes =>
            [
                new ApiScope("api.skincare", "Access to Skincare API")
            ];

        public static IEnumerable<Client> Clients =>
            [
                new Client
                {
                    ClientId = "webportal",
                    ClientSecrets = { new Secret("secret".Sha256()) },
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireConsent = false,
                    RequirePkce = true,
                    AllowOfflineAccess = true,
                    RedirectUris = { "https://localhost:7261/signin-oidc" },
                    PostLogoutRedirectUris = { "https://localhost:7261/signout-callback-oidc" },
                    AllowedScopes = new List<string>
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.OfflineAccess,
                        "api.skincare"
                    }
                },
                new Client
                {
                    ClientId = "swagger_client",
                    ClientName = "Swagger Client",

                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,
                    RequireClientSecret = false,

                    RedirectUris =           { "https://localhost:7261/swagger/oauth2-redirect.html" },
                    PostLogoutRedirectUris = { "https://localhost:7261/swagger/oauth2-redirect.html" },
                    AllowedCorsOrigins =     { "https://localhost:7261" },

                    AllowedScopes = new List<string>
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "api.skincare"
                    }
                }



            ];

    }
}
