using Application.Activities.Command;
using Application.Activities.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new GetActivityList.Query());
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivityDetail(string id)
    {
        var activity = await Mediator.Send(new GetActivityDetails.Query { Id = id });

        if (activity == null)
        {
            return NotFound();
        }

        return activity;
    }

    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
        var id = await Mediator.Send(new CreateActivity.Command { Activity = activity });

        // This ensures the React app receives the ID and redirects to the correct URL
        // instead of navigating to /activities/undefined
        return Ok(id);
    }

    // [HttpPost]
    // public async Task<IActionResult> CreateActivity(Activity activity)
    // {
    //     var id = await Mediator.Send(new CreateActivity.Command { Activity = activity });
    //     return Ok(id);
    // }

    [HttpPut]
    public async Task<ActionResult<string>> EditActivity(Activity activity)
    {
        await Mediator.Send(new EditActivity.Command { Activity = activity });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        await Mediator.Send(new DeleteActivity.Command { Id = id });

        return Ok();
    }
}