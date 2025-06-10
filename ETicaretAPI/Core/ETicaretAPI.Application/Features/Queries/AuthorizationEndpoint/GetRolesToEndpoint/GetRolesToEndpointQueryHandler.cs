using ETicaretAPI.Application.Abstractions.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Queries.AuthorizationEndpoint.GetRolesToEndpoints
{
    public class GetRolesToEndpointQueryHandler : IRequestHandler<GetRolesToEndpointQueryRequest, GetRolesToEndpointQueryResponse>
    {
        readonly IAuthorizationEndpointService _authorizationEndpointService;

        public GetRolesToEndpointQueryHandler(IAuthorizationEndpointService authorizationEndpointService)
        {
            _authorizationEndpointService = authorizationEndpointService;
        }

        public async Task<GetRolesToEndpointQueryResponse> Handle(GetRolesToEndpointQueryRequest request, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Code) || string.IsNullOrEmpty(request.Menu))
                    throw new ArgumentException("Code and Menu cannot be null or empty");

                var datas = await _authorizationEndpointService.GetRolesToEndpointAsync(request.Code, request.Menu);
                return new()
                {
                    Roles = datas ?? new List<string>()
                };
            }
            catch (Exception ex)
            {
                // Log the error here if you have a logging service
                throw new Exception($"Error in GetRolesToEndpointQueryHandler: {ex.Message}", ex);
            }
        }
    }
}
