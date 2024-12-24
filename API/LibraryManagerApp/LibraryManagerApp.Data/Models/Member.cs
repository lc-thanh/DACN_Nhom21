using LibraryManagerApp.Data.Enum;
using System.ComponentModel.DataAnnotations;

namespace LibraryManagerApp.Data.Models
{
    public class Member : User
    {
        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string IndividualId { get; set; }

        [Required]
        public MemberStatus Status { get; set; } = MemberStatus.Normal; 

        public int GetMembershipDays()
        {
            TimeSpan difference = DateTime.Now - CreatedOn;
            return difference.Days;
        }

        public IList<Loan> Loans { get; set; }
    }
}
