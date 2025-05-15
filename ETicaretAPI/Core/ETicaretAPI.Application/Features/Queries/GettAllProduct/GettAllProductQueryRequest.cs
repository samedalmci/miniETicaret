using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ETicaretAPI.Application.RequestParameters;
using MediatR;

namespace ETicaretAPI.Application.Features.Queries.GettAllProduct
{
    public class GettAllProductQueryRequest : IRequest<GettAllProductQueryResponse>
    {
        //public Pagination Pagination { get; set; }

        public int Page { get; set; } = 0;

        public int Size { get; set; } = 5;
    }
}
