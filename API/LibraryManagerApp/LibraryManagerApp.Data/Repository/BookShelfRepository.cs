using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.Data.Repository
{
    public class BookShelfRepository : BaseRepository<BookShelf>, IBookShelfRepository
    {
        public BookShelfRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<IList<BookShelfViewModal>> GetAllBookshelvesWithBookCount()
        {
            var query = _context.BookShelves.Include(bs => bs.Books).Include(bs => bs.Cabinet);
            IList<BookShelfViewModal> list = await query.Select(c => new BookShelfViewModal
            {
                Id = c.Id,
                Name = c.Name,
                CreatedOn = c.CreatedOn,
                BooksCount = c.Books.Count,
                CabinetId = c.CabinetId,
                CabinetName = c.Cabinet.Name,
            }).ToListAsync();

            return list;
        }

        public async Task<BookShelfViewModal?> GetBookShelfWithBookCount(Guid id)
        {
            var query = _context.BookShelves.Include(bs => bs.Books).Include(bs => bs.Cabinet);
            BookShelfViewModal? bookshelf = await query.Select(c => new BookShelfViewModal
            {
                Id = c.Id,
                Name = c.Name,
                CreatedOn = c.CreatedOn,
                BooksCount = c.Books.Count,
                CabinetId = c.CabinetId,
                CabinetName = c.Cabinet.Name,
            }).FirstOrDefaultAsync(bs => bs.Id.Equals(id));

            return bookshelf;
        }
    }
}
