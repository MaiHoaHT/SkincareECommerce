using FluentValidation;

namespace SkincareWeb.ViewModels.Cosmetics
{
    public class BrandCreateRequestValidation : AbstractValidator<BrandCreateRequest>
    {
        public BrandCreateRequestValidation()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Title is required.")
                .Length(1, 150)
                .WithMessage("Title must be between 1 and 150 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.Banner)
                .MaximumLength(250)
                .WithMessage("Banner cannot exceed 250 characters.");

            RuleFor(x => x.Alias)
                .MaximumLength(150)
                .WithMessage("Alias cannot exceed 150 characters.");
        }
    }
}
