using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace LibraryManagerApp.Data.Repository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));

            return user;
        }

        public async Task<User?> GetByPhoneAsync(string phone)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone.Equals(phone));

            return user;
        }
    }
}
