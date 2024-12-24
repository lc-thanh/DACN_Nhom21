using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface IMemberRepository : IBaseRepository<Member>
    {
        Task<Member?> GetByPhoneAsync(string phone);
        Task<Member?> GetByIndividualIdAsync(string individualId);
        IQueryable<Member> GetQueryFullInfors();
        Task<Member?> GetFullInforsByIdAsync(Guid id);
        Task<int?> OnLoansCount(Guid id);
    }
}
