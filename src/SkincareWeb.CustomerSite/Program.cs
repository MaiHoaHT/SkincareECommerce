using Microsoft.Extensions.DependencyInjection.Extensions;
using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.CustomerSite.Services;
using SkincareWeb.CustomerSite.Services.IServices;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
if (builder.Environment.IsDevelopment())
{
	builder.Services.AddControllersWithViews()
		.AddRazorRuntimeCompilation()
		.AddJsonOptions(options =>
		{
			options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
			options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
		});
}
else
{
	builder.Services.AddControllersWithViews()
		.AddJsonOptions(options =>
		{
			options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
			options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
		});
}

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", builder =>
	{
		builder.AllowAnyOrigin()
			   .AllowAnyMethod()
			   .AllowAnyHeader();
	});
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultScheme = "Cookies";
	options.DefaultChallengeScheme = "oidc";
})
.AddCookie("Cookies")
.AddOpenIdConnect("oidc", options =>
{
	options.Authority = "https://localhost:7261";  // Địa chỉ IdentityServer
	options.ClientId = "webportal";
	options.ClientSecret = "secret";
	options.ResponseType = "code";

	options.Scope.Add("openid");
	options.Scope.Add("profile");
	options.Scope.Add("offline_access");
	options.Scope.Add("api.skincare");

	options.GetClaimsFromUserInfoEndpoint = true;
	options.SaveTokens = true;
	options.RequireHttpsMetadata = false;  // Tắt kiểm tra HTTPS khi chạy localhost
	options.SignedOutRedirectUri = "https://localhost:7086";
	options.CallbackPath = "/signin-oidc";

	options.Events = new Microsoft.AspNetCore.Authentication.OpenIdConnect.OpenIdConnectEvents
	{
		OnTokenValidated = async context =>
		{
			var accessToken = context.TokenEndpointResponse?.AccessToken;
			if (!string.IsNullOrEmpty(accessToken))
			{
				context.Principal?.AddIdentity(new System.Security.Claims.ClaimsIdentity(
					new[] { new System.Security.Claims.Claim("access_token", accessToken) }
				));
			}
		}
	};
});

// Configure HttpClient
builder.Services.AddHttpClient("BackendApi", client =>
{
	client.BaseAddress = new Uri("https://localhost:7261/api/");
	client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
});

// Register IHttpContextAccessor first
builder.Services.AddHttpContextAccessor();

// Declare service for the API
builder.Services.AddTransient<IProductService, ProductService>();
builder.Services.AddTransient<ICategoryService, CategoryService>();
builder.Services.AddTransient<IBrandService, BrandService>();
builder.Services.AddTransient<IRatingService, RatingService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Use CORS
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
		name: "ProductByCategoryId",
		pattern: "/product/danh-muc-{id}",
		new { controller = "Products", action = "ProductByCategoryId" });
app.MapControllerRoute(
		name: "ProductDetails",
		pattern: "/product-detail/{name}-{id}",
		new { controller = "Products", action = "ProductDetails" });

app.MapControllerRoute(
		name: "AddRating",
		pattern: "/product/{productId}/rating/add",
		new { controller = "Products", action = "AddRating" });

app.MapControllerRoute(
		name: "UpdateRating",
		pattern: "/product/{productId}/rating/{id}/update",
		new { controller = "Products", action = "UpdateRating" });

app.MapControllerRoute(
		name: "DeleteRating",
		pattern: "/product/{productId}/rating/{id}/delete",
		new { controller = "Products", action = "DeleteRating" });

app.MapControllerRoute(
		name: "FeaturedProducts",
		pattern: "products/featured",
		new { controller = "Products", action = "FeaturedProducts" });

app.MapControllerRoute(
		name: "HotProducts",
		pattern: "products/hot",
		new { controller = "Products", action = "HotProducts" });

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
