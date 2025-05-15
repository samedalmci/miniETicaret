using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ETicaretAPI.Application.Repositories;
using ETicaretAPI.Application.RequestParameters;
using MediatR;

namespace ETicaretAPI.Application.Features.Queries.Product.GettAllProduct
{
    public class GettAllProductQueryHandler : IRequestHandler<GettAllProductQueryRequest, GettAllProductQueryResponse>
    {
        readonly IProductReadRepository _productReadRepository;

        public GettAllProductQueryHandler(IProductReadRepository productReadRepository) 
        {
            _productReadRepository = productReadRepository;
        }



        public async Task<GettAllProductQueryResponse> Handle(GettAllProductQueryRequest request, CancellationToken cancellationToken)
        {
            var totalCount = _productReadRepository.GetAll(false).Count();
            var products = _productReadRepository.GetAll(false).Skip(request.Page * request.Size).Take(request.Size).Select(p => new
            {
                p.Id,
                p.Name,
                p.Stock,
                p.Price,
                p.CreatedDate,
                p.UpdateDate
            }).ToList();

            return new()
            {
                products = products,
                totalCount = totalCount,
               
            };
        }
    }
}
