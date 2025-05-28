using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ETicaretAPI.Application.DTOs.Order;

namespace ETicaretAPI.Application.Abstractions.Services
{
    public interface IOrderService
    {
        Task CreateOrderAsync(CreateOrder createOrder);
        Task<ListOrder> GetAllOrdersAsync(int page, int size);
    }
}
