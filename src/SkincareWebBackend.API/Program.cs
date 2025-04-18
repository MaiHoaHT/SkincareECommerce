using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SkincareWeb.ViewModels.Systems;
using SkincareWebBackend.API.Data;
using SkincareWebBackend.API.Data.Entities;

var builder = WebApplication.CreateBuilder(args);

// Kết nối cơ sở dữ liệu
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Đăng ký dịch vụ khởi tạo dữ liệu
builder.Services.AddTransient<DataInitalizer>();

// Thêm dịch vụ MVC & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RoleViewModelValidation>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

var app = builder.Build();

// Cấu hình pipeline cho môi trường dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Khởi tạo dữ liệu khi ứng dụng khởi động
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dataInitializer = services.GetRequiredService<DataInitalizer>();
    await dataInitializer.Seed();
    Console.WriteLine("Seed data thành công!");

    try
    {
        await dataInitializer.Seed();
        Console.WriteLine(" Seed data thành công!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($" Lỗi khi seed data: {ex.Message}");
    }
}

app.Run();
