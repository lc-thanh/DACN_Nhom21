using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface IMemberRepository : IBaseRepository<Member>
    {
        Task<Member?> GetByPhoneAsync(string phone);
        Task<Member?> GetByIndividualIdAsync(string individualId);
    }
}
