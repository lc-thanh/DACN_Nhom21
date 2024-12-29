using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Models;
using System.ComponentModel.DataAnnotations;

namespace LibraryManagerApp.Data.Dto
{
    public class LoanViewModel
    {
        public Guid Id { get; set; }
        public string LoanCode { get; set; } // Search

        public DateTime? LoanDate { get; set; } // Time period + OrderBy

        public DateTime DueDate { get; set; } // OrderBy

        public DateTime? ReturnedDate { get; set; } // OrderBy

        public int Deposit { get; set; }

        public StatusEnum Status { get; set; } // FacetedFilter

        public Guid MemberId { get; set; }
        public string MemberPhone { get; set; } // Search
        public string MemberFullName { get; set; } // Search

        public Guid? LibrarianId { get; set; }
        public string? LibrarianFullName { get; set; } // Search

        public IList<string> BookNames { get; set; }

        public IList<string>? Warning { get; set; }
    }
}
