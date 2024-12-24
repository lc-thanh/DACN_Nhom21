using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface ICabinetRepository : IBaseRepository<Cabinet>
    {
        Task<IList<CabinetViewModal>> GetAllCabinetsWithAllInfors();
        Task<CabinetViewModal?> GetCabinetWithAllInfors(Guid id);
    }
}
