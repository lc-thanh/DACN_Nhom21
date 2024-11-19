using LibraryManagerApp.Data.Validation;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.InteropServices;

namespace LibraryManagerApp.Data.Dto
{
    public class UserSignUp
    {
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string FullName { get; set; }

        private string? email;
        [EmailAddress] // Validate Email 
        [AllowNull]
        [MaxLength(255)]
        public string? Email
        {
            get { return email; }

            set { email = string.IsNullOrEmpty(value) ? null : value; }
        }

        [Required]
        [RegularExpression(@"^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$", ErrorMessage = "PhoneNumber is not in correct format!")]
        public string Phone { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string IndividualId { get; set; }

        [Required]
        [PasswordStrength] // Validate password
        public string Password { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }
    }
}
