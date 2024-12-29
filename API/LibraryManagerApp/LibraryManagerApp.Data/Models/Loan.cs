using LibraryManagerApp.Data.Enum;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace LibraryManagerApp.Data.Models
{
    public class Loan
    {
        public Guid Id { get; set; }

        [Required]
        public string LoanCode { get; set; }

        [Required]
        public DateTime LoanDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? ReturnedDate { get; set; }

        [Required]
        [Range(0, 99999999)]
        public int Deposit { get; set; }

        [Required]
        public StatusEnum Status { get; set; }

        [Required]
        public Guid MemberId { get; set; }
        public Member Member { get; set; }

        public Guid? LibrarianId { get; set; }
        public Librarian Librarian { get; set; }

        public IList<LoanDetail> LoanDetails { get; set; }
    }
}
