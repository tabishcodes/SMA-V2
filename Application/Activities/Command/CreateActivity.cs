using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.Command;

public class CreateActivity
{
    public class Command : IRequest<string>
    {
        public required Activity Activity { get; set; }
    }

    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
            RuleFor(x => x.Date).GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");
            RuleFor(x => x.Category).NotEmpty().WithMessage("Category is required");
            RuleFor(x => x.City).NotEmpty().WithMessage("City is required");
            RuleFor(x => x.Venue).NotEmpty().WithMessage("Venue is required");
            RuleFor(x => x.Latitude).NotEmpty().WithMessage("Latitude is required");
            RuleFor(x => x.Longitude).NotEmpty().WithMessage("Longitude is required");
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
        }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
            context.Activities.Add(request.Activity);
            await context.SaveChangesAsync(cancellationToken);

            return request.Activity.Id;
        }
    }
}