using FluentValidation;
using SkincareWeb.ViewModels.Product;

namespace SkincareWeb.ViewModels.Cosmetics
{
    public class ProductCreateRequestValidation : AbstractValidator<ProductCreateRequest>
    {
        public ProductCreateRequestValidation()
        {
            RuleFor(x => x.Name)
                .NotNull()
                .NotEmpty()
                .WithMessage(string.Format(Messages.Required, "Tên sản phẩm"))
                .MaximumLength(250)
                .WithMessage(string.Format(Messages.MaxLength, "Tên sản phẩm", 250));

            // Mô tả sản phẩm
            RuleFor(x => x.Description)
                .NotNull()
                .NotEmpty()
                .WithMessage(string.Format(Messages.Required, "Mô tả sản phẩm"))
                .MaximumLength(1000)
                .WithMessage(string.Format(Messages.MaxLength, "Mô tả sản phẩm", 1000));

            // Giá sản phẩm
            RuleFor(x => x.Price)
                .GreaterThan(0)
                .WithMessage(string.Format(Messages.InvalidDetail, "Giá sản phẩm", "Giá sản phẩm lớn hơn 0"));

            // Giảm giá
            RuleFor(x => x.Discount)
                .GreaterThanOrEqualTo(0)
                .WithMessage(string.Format(Messages.Invalid, "Giảm giá"))
                .LessThanOrEqualTo(x => x.Price)
                .WithMessage("Giảm giá không thể lớn hơn giá sản phẩm.");

            // Hình ảnh sản phẩm
            RuleFor(x => x.ImageUrl)
                .NotNull()
                .NotEmpty()
                .WithMessage(string.Format(Messages.Required, "URL hình ảnh"))
                .Must(url => Uri.IsWellFormedUriString(url, UriKind.Absolute))
                .WithMessage(string.Format(Messages.Invalid, "URL hình ảnh"));

            // Danh mục sản phẩm
            RuleFor(x => x.CategoryId)
                .GreaterThan(0)
                .WithMessage(string.Format(Messages.Invalid, "Mã danh mục"));

            // Thương hiệu
            RuleFor(x => x.BrandId)
                .GreaterThan(0)
                .WithMessage(string.Format(Messages.Invalid, "Mã thương hiệu"));

            // Alias SEO
            RuleFor(x => x.SeoAlias)
                .NotNull()
                .NotEmpty()
                .WithMessage(string.Format(Messages.Required, "SeoAlias"))
                .MaximumLength(250)
                .WithMessage(string.Format(Messages.MaxLength, "SeoAlias", 250));

            // Số lượng trong kho
            RuleFor(x => x.Quantity)
                .GreaterThanOrEqualTo(0)
                .WithMessage(string.Format(Messages.Invalid, "Số lượng"));

            // Số lượng đã bán
            RuleFor(x => x.Sold)
                .GreaterThanOrEqualTo(0)
                .WithMessage(string.Format(Messages.Invalid, "Số lượng bán"));

            // Trạng thái
            RuleFor(x => x.Status)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "Trạng thái"));

            // Đánh dấu nổi bật
            RuleFor(x => x.IsFeature)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "IsFeature"));

            // Hiển thị ở trang chủ
            RuleFor(x => x.IsHome)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "IsHome"));

            // Đánh dấu sản phẩm hot
            RuleFor(x => x.IsHot)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "IsHot"));

            // Trạng thái hoạt động
            RuleFor(x => x.IsActive)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "IsActive"));

            // Ngày tạo
            RuleFor(x => x.CreateDate)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "Ngày tạo"))
                .LessThanOrEqualTo(DateTime.Now)
                .WithMessage(string.Format(Messages.Invalid, "Ngày tạo"));

            // Ngày sửa đổi
            RuleFor(x => x.LastModifiedDate)
                .NotNull()
                .WithMessage(string.Format(Messages.Required, "Ngày sửa đổi"))
                .GreaterThanOrEqualTo(x => x.CreateDate)
                .WithMessage("Ngày sửa đổi không được nhỏ hơn ngày tạo.");
        }
    }
}
