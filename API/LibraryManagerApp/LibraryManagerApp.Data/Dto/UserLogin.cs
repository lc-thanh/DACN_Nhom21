using System.ComponentModel.DataAnnotations;

namespace LibraryManagerApp.Data.Dto
{
    public class UserLogin
    {
        [Required]
        [RegularExpression(@"^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$", ErrorMessage = "PhoneNumber is not in correct format!")]
        public string Phone { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
