using FluentValidation;

namespace SkincareWeb.ViewModels.Systems
{
    public class RoleViewModelValidation : AbstractValidator<RoleViewModel>
    {
        public RoleViewModelValidation()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("ID is required")
                .MaximumLength(50).WithMessage("Role id length can not over limit 50 characters ");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name value is required");
        }
    }
}
