using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface ILoanRepository : IBaseRepository<Loan>
    {
        Task<Loan?> FindByCodeAsync(string code);
        string GenerateLoanCode();
        Task CreateLoanAsync(Loan loan);
        IQueryable<Loan> GetAllInforsQuery();
        IQueryable<Loan> GetAllInforsQueryByMemberPhone(string phone);
        Task<Loan?> GetLoanByIdAsync(Guid loanId);
    }
}
