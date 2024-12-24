using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class MemberViewModel
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }

        public string IndividualId { get; set; }

        public string Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public DateTime CreatedOn { get; set; } // OrderBy

        public int? LoansCount { get; set; } // OrderBy

        public MemberStatus Status { get; set; } // FacetedFilter

        public bool isLocked { get; set; } // Selector
    }
}
