using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace LibraryManagerApp.Data.Repository
{
    public class MemberRepository : BaseRepository<Member>, IMemberRepository
    {
        public MemberRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public IQueryable<Member> GetQueryFullInfors()
        {
            var members = _context.Members.Include(m => m.Loans);

            return members;
        }

        public async Task<Member?> GetByIndividualIdAsync(string individualId)
        {
            var member = await _context.Members.FirstOrDefaultAsync(m => m.IndividualId.Equals(individualId));

            return member;
        }

        public async Task<Member?> GetByPhoneAsync(string phone)
        {
            var member = await _context.Members.FirstOrDefaultAsync(m => m.Phone.Equals(phone));

            return member;
        }

        public Task<Member?> GetFullInforsByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<int?> OnLoansCount(Guid id)
        {
            var member = await _context.Members.Include(m => m.Loans).FirstOrDefaultAsync(m => m.Id.Equals(id));
            if (member == null)
                return null;

            int onLoanCount = member.Loans.Count(loan => loan.Status == StatusEnum.OnLoan);
            return onLoanCount;
        }
    }
}
