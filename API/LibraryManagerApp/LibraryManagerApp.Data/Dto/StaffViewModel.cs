using LibraryManagerApp.Data.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class StaffViewModel
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }

        public string Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public DateTime CreatedOn { get; set; } // OrderBy

        public int? LoansCount { get; set; } // OrderBy

        public RoleEnum Role { get; set; }

        public bool isLocked { get; set; } // Selector
    }
}
