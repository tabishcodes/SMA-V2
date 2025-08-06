using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Command;

public class EditActivity
{
    public class Command : IRequest<string>
    {
        public required Activity Activity { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle(Command request, CancellationToken cancellationToken)
        {
                var activity = await context.Activities
                    .FindAsync([request.Activity.Id],cancellationToken)
                        ?? throw new Exception("Activity not found");

            mapper.Map(request.Activity, activity);

            await context.SaveChangesAsync(cancellationToken);

            return activity.Id;

        }
    }
}
