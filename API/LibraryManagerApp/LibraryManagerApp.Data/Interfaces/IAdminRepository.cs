﻿using LibraryManagerApp.Data.Models;

namespace LibraryManagerApp.Data.Interfaces
{
    public interface IAdminRepository : IBaseRepository<Admin>
    {
        Task<Admin?> GetByPhoneAsync(string phone);
    }
}
