using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.BackendServer.Service;
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

// 🔹 Cấu hình xác thực Local API và JWT
builder.Services.AddAuthentication()
    .AddLocalApi("Bearer", options =>
    {
        options.ExpectedScope = "api.skincare";
    })
    .AddJwtBearer("JwtBearer", options => // 👈 Đổi tên scheme để tránh xung đột
    {
        options.Authority = builder.Configuration["IdentityServer:Authority"];
        options.RequireHttpsMetadata = false;
        options.Audience = "api.skincare";
    });

// 🔹 Đăng ký Authorization Policy
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

// 🔹 Đăng ký dịch vụ MVC, Razor Pages & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMvc();

// 🔹 Đăng ký dịch vụ FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RoleViewModelValidation>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

// 🔹 Đăng ký Data Seeding
builder.Services.AddTransient<DataInitalizer>();
builder.Services.AddTransient<IEmailSender, EmailSenderService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🔹 Cấu hình middleware (.NET 8)
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();
app.MapControllers();
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapDefaultControllerRoute();
app.MapRazorPages(); // 👈 Kích hoạt giao diện đăng nhập
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
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
