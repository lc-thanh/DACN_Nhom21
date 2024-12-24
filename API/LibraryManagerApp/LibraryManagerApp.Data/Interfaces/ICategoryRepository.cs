using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Models;
using System.Collections;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<IList<CategoryViewModal>> GetAllCategoriesWithBookCount();
        Task<CategoryViewModal?> GetCategoryWithBookCount(Guid id);
    }
}
