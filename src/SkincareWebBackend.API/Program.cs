using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SkincareWeb.BackendServer.Service;
using SkincareWeb.BackendServer.Services;
using SkincareWeb.ViewModels.Systems;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;
using SkincareWebBackend.IdentityServer;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Kết nối cơ sở dữ liệu
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔹 Cấu hình ASP.NET Core Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// 🔹 Cấu hình Duende IdentityServer (.NET 8)
builder.Services.AddIdentityServer()
    .AddAspNetIdentity<User>()
    .AddInMemoryClients(IdentityServerConfig.Clients)
    .AddInMemoryApiResources(IdentityServerConfig.ApiResources)
    .AddInMemoryApiScopes(IdentityServerConfig.ApiScopes)
    .AddInMemoryIdentityResources(IdentityServerConfig.IdentityResources);

// 🔹 Đăng ký `AddLocalApiAuthentication()` đúng cách
builder.Services.AddLocalApiAuthentication();

// Cấu hình xác thực Local API và JWT
builder.Services.AddAuthentication()
    .AddLocalApi("Bearer", options =>
    {
        options.ExpectedScope = "api.skincare";
    })
    .AddJwtBearer("JwtBearer", options =>
    {
        options.Authority = builder.Configuration["IdentityServer:Authority"];
        options.RequireHttpsMetadata = false;
        options.Audience = "api.skincare";
    });

// Đăng ký Authorization Policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Bearer", policy =>
    {
        policy.AddAuthenticationSchemes("Bearer");
        policy.RequireAuthenticatedUser();
    });

    options.AddPolicy("ApiScope", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "api.skincare");
    });
});

// 🔹 Đăng ký dịch vụ MVC, Razor Pages & Swagger với OAuth2
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri(builder.Configuration["IdentityServer:Authority"] + "/connect/authorize"),
                TokenUrl = new Uri(builder.Configuration["IdentityServer:Authority"] + "/connect/token"),
                Scopes = new Dictionary<string, string> { { "api.skincare", "Skincare API" } }
            }
        }
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>{ "api.skincare" }
        }
    });
});
builder.Services.AddRazorPages(options =>
{
    options.Conventions.AddAreaFolderRouteModelConvention("Identity", "/Account/", model =>
    {
        foreach (var selector in model.Selectors)
        {
            var attributeRouteModel = selector.AttributeRouteModel;
            attributeRouteModel.Order = -1;
            if (attributeRouteModel.Template.StartsWith("Identity"))
            {
                attributeRouteModel.Template = attributeRouteModel.Template.Remove(0, "Identity".Length);
            }
        }
    });
});

// Đăng ký dịch vụ FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RoleViewModelValidation>();
//builder.Services.AddValidatorsFromAssemblyContaining<UserCreateRequestValidation>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddRazorPages();


// Đăng ký Service Data seed và Email
builder.Services.AddTransient<DataInitalizer>();
builder.Services.AddTransient<IEmailSender, EmailSenderService>();
builder.Services.AddTransient<ICacheService, DistributedCacheService>();
var app = builder.Build();

// 🔹 Cấu hình middleware (.NET 8)
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();
app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages(); // 👈 Kích hoạt giao diện đăng nhập

// 🔹 Kích hoạt Swagger UI với OAuth2
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.OAuthClientId("swagger_client");
        options.OAuthUsePkce();
    });
}

// 🔹 Khởi tạo dữ liệu khi ứng dụng khởi động
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dataInitializer = services.GetRequiredService<DataInitalizer>();

    try
    {
        await dataInitializer.Seed();
        Console.WriteLine("✅ Seed data thành công!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Lỗi khi seed data: {ex.Message}");
    }
}

app.Run();
