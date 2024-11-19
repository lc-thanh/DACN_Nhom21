using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.Data.Repository
{
    public class LibrarianRepository : BaseRepository<Librarian>, ILibrarianRepository
    {
        public LibrarianRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<Librarian?> GetByPhoneAsync(string phone)
        {
            var librarian = await _context.Librarians.FirstOrDefaultAsync(u => u.Phone.Equals(phone));

            return librarian;
        }
    }
}
