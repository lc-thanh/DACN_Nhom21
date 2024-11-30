using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.Data.Repository
{
    public class UserTokenRepository : BaseRepository<UserToken>, IUserTokenRepository
    {
        public UserTokenRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<UserToken?> GetByRefreshToken(string refreshToken)
        {
            return await _context.UserTokens.Include(ut => ut.User).FirstOrDefaultAsync(x => x.RefreshToken.Equals(refreshToken));
        }

        public async Task<bool> RemoveAllExpiredTokens()
        {
            _context.UserTokens.RemoveRange(
                _context.UserTokens.Where(ut => ut.ExpiresAt < DateTime.Now)
            );
            var saved = await _context.SaveChangesAsync();

            if (saved > 0)
                return true;
            return false;
        }
    }
}
