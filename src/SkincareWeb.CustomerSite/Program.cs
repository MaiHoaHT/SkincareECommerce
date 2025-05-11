using Microsoft.Extensions.DependencyInjection.Extensions;
using SkincareWeb.CustomerSite.Service.IService;
using SkincareWeb.CustomerSite.Services;
using SkincareWeb.CustomerSite.Services.IServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
if (builder.Environment.IsDevelopment())
{
	builder.Services.AddControllersWithViews()
		.AddRazorRuntimeCompilation();
}
else
{
	builder.Services.AddControllersWithViews();
}

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
});
builder.Services.AddHttpClient("BackendApi", client =>
{
	client.BaseAddress = new Uri("https://localhost:7261/api/");
});

// Declare service for the API
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<IProductService, ProductService>();
builder.Services.AddTransient<ICategoryService, CategoyService>();
builder.Services.AddTransient<IBrandService, BrandService>();


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

app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
