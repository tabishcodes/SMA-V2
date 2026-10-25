using Domain;
using FluentValidation;

namespace Application.Activities.Validators;

public class BaseActivityValidator : AbstractValidator<Activity>
{
    public BaseActivityValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
        RuleFor(x => x.Date).GreaterThan(DateTime.UtcNow.Date.AddDays(-1)).WithMessage("Date must be in the future"); RuleFor(x => x.Category).NotEmpty().WithMessage("Category is required");
        RuleFor(x => x.City).NotEmpty().WithMessage("City is required");
        RuleFor(x => x.Venue).NotEmpty().WithMessage("Venue is required");
        RuleFor(x => x.Latitude).NotEmpty().WithMessage("Latitude is required");
        RuleFor(x => x.Longitude).NotEmpty().WithMessage("Longitude is required");
    }
}