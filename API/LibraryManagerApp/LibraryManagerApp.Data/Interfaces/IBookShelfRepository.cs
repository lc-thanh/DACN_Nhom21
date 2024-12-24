using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface IBookShelfRepository : IBaseRepository<BookShelf>
    {
        Task<IList<BookShelfViewModal>> GetAllBookshelvesWithBookCount();
        Task<BookShelfViewModal?> GetBookShelfWithBookCount(Guid id);
    }
}
