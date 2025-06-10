using ETicaretAPI.Application.Features.Commands.AuthorizationEndpoint.AssignRoleEndpoint;
using ETicaretAPI.Application.Features.Queries.AuthorizationEndpoint.GetRolesToEndpoints;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ETicaretAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizationEndpointsController : ControllerBase
    {
        readonly IMediator _mediator;

        public AuthorizationEndpointsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetRolesToEndpoint(GetRolesToEndpointQueryRequest rolesToEndpointQueryRequest)
        {
            try
            {
                if (rolesToEndpointQueryRequest == null)
                    return BadRequest("Request cannot be null");

                GetRolesToEndpointQueryResponse response = await _mediator.Send(rolesToEndpointQueryRequest);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AssignRoleEndpoint(AssignRoleEndpointCommandRequest assignRoleEndpointCommandRequest)
        {
            try
            {
                if (assignRoleEndpointCommandRequest == null)
                    return BadRequest("Request cannot be null");

                assignRoleEndpointCommandRequest.Type = typeof(Program);
                AssignRoleEndpointCommandResponse response = await _mediator.Send(assignRoleEndpointCommandRequest);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}