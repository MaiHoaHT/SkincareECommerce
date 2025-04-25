using FluentValidation;

namespace SkincareWeb.ViewModels.Cosmetics
{
    public class CategoryCreateRequestValidation : AbstractValidator<CategoryCreateRequest>
    {
        public CategoryCreateRequestValidation()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage(string.Format(Messages.Required, "Tên"));

            RuleFor(x => x.SeoAlias).NotEmpty().WithMessage(string.Format(Messages.Required, "Seo alias"));
        }
    }
}
