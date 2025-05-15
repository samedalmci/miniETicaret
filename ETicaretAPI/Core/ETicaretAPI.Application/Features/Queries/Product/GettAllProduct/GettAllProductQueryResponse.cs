using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ETicaretAPI.Application.Features.Queries.Product.GettAllProduct
{
    public class GettAllProductQueryResponse
    {
        public int totalCount { get; set; }

        public object products { get; set; }
    }
}
