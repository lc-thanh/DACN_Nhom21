using System.ComponentModel.DataAnnotations;

namespace LibraryManagerApp.Data.Dto
{
    public class TokenModel
    {
        [Required]
        public string AccessToken { get; set; }

        [Required]
        public string RefreshToken { get; set; }
    }
}
