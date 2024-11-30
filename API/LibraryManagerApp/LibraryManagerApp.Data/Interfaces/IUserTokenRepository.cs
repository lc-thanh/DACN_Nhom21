using LibraryManagerApp.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface IUserTokenRepository : IBaseRepository<UserToken>
    {
        Task<UserToken?> GetByRefreshToken(string refreshToken);

        Task<Boolean> RemoveAllExpiredTokens();
    }
}
