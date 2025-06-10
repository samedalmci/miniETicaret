using MediatR;
using System.ComponentModel.DataAnnotations;

namespace ETicaretAPI.Application.Features.Queries.AuthorizationEndpoint.GetRolesToEndpoints
{
    public class GetRolesToEndpointQueryRequest : IRequest<GetRolesToEndpointQueryResponse>
    {
        [Required(ErrorMessage = "Code is required")]
        public string Code { get; set; } = string.Empty;

        [Required(ErrorMessage = "Menu is required")]
        public string Menu { get; set; } = string.Empty;
    }
}