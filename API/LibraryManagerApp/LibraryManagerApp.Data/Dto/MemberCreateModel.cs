using LibraryManagerApp.Data.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryManagerApp.Data.Dto
{
    public class MemberCreateModel
    {
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string FullName { get; set; }

        [EmailAddress] // Validate Email 
        [MaxLength(255)]
        public string? Email { get; set; }

        [Required]
        [RegularExpression(@"^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$", ErrorMessage = "PhoneNumber is not in correct format!")]
        public string Phone { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string IndividualId { get; set; }
    }
}
