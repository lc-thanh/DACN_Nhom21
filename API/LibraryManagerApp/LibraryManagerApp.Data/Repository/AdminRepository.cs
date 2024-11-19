using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.Data.Repository
{
    public class AdminRepository : BaseRepository<Admin>, IAdminRepository
    {
        public AdminRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<Admin?> GetByPhoneAsync(string phone)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(u => u.Phone.Equals(phone));

            return admin;
        }
    }
}
