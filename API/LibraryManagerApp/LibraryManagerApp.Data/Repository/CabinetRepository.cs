using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.Data.Repository
{
    public class CabinetRepository : BaseRepository<Cabinet>, ICabinetRepository
    {
        public CabinetRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<IList<CabinetViewModal>> GetAllCabinetsWithAllInfors()
        {
            var query = _context.Cabinets.Include(c => c.BookShelves);
            IList<CabinetViewModal> list = await query.Select(c => new CabinetViewModal
            {
                Id = c.Id,
                Name = c.Name,
                CreatedOn = c.CreatedOn,
                Location = c.Location,
                BookShelfNames = c.BookShelves.Select(bs => bs.Name).ToArray()
            }).ToListAsync();

            return list;
        }

        public async Task<CabinetViewModal?> GetCabinetWithAllInfors(Guid id)
        {
            var query = _context.Cabinets.Include(c => c.BookShelves);
            CabinetViewModal? cabinet = await query.Select(c => new CabinetViewModal
            {
                Id = c.Id,
                Name = c.Name,
                CreatedOn = c.CreatedOn,
                Location = c.Location,
                BookShelfNames = c.BookShelves.Select(bs => bs.Name).ToArray()
            }).FirstOrDefaultAsync(c => c.Id.Equals(id));

            return cabinet;
        }
    }
}
