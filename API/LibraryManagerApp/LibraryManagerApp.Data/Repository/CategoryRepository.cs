using LibraryManagerApp.Data.Data;
using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections;

namespace LibraryManagerApp.Data.Repository
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(LibraryManagerAppDbContext context) : base(context)
        {
        }

        public async Task<IList<CategoryViewModal>> GetAllCategoriesWithBookCount()
        {
            var query = _context.Categories.Include(c => c.Books);
            IList<CategoryViewModal> list = await query.Select(c => new CategoryViewModal
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                CreatedOn = c.CreatedOn,
                BooksCount = c.Books.Count
            }).ToListAsync();

            return list;
        }
    }
}
