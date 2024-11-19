using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.Data.Repository
{
    public class MemberRepository : BaseRepository<Member>, IMemberRepository
    {
        public MemberRepository(LibraryManagerAppDbContext context) : base(context)
        {
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
    }
}
