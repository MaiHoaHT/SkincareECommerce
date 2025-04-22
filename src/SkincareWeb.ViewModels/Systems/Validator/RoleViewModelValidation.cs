using FluentValidation;

namespace SkincareWeb.ViewModels.Systems.Validator
{
    public class RoleViewModelValidation : AbstractValidator<RoleViewModel>
    {
        public RoleViewModelValidation()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage(string.Format(Messages.Required, "ID"))
                .MaximumLength(50).WithMessage(string.Format(Messages.MaxLength, "Role ID", "50"));
            RuleFor(x => x.Name).NotEmpty().WithMessage(string.Format(Messages.Required, "Role Name"));
        }
    }
}
