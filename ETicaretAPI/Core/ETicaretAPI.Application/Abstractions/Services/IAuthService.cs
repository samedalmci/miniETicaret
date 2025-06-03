using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ETicaretAPI.Application.Abstractions.Services.Authentication;
using Microsoft.Extensions.Options;

namespace ETicaretAPI.Application.Abstractions.Services
{
    public interface IAuthService : IExtrenalAuthentication, IInternalAuthentication
    {
        Task PasswordResetAsnyc(string email); 
        Task<bool> VerifyResetTokenAsync(string resetToken, string userId);
    }
}
