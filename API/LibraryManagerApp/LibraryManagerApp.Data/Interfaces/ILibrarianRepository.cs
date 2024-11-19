using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface ILibrarianRepository : IBaseRepository<Librarian>
    {
        Task<Librarian?> GetByPhoneAsync(string phone);
    }
}
