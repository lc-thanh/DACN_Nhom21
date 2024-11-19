using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace LibraryManagerApp.Data.Validation
{
    public class PasswordStrengthAttribute : ValidationAttribute
    {
        private readonly int _minLength;

        public PasswordStrengthAttribute(int minLength = 8)
        {
            _minLength = minLength;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var password = value as string;

            if (string.IsNullOrWhiteSpace(password))
            {
                return new ValidationResult("Mật khẩu không được để trống!");
            }

            if (password.Length < _minLength)
            {
                return new ValidationResult($"Mật khẩu phải có ít nhất {_minLength} ký tự!");
            }

            if (!Regex.IsMatch(password, @"[A-Z]"))
            {
                return new ValidationResult("Mật khẩu phải có ít nhất 1 chữ cái viết hoa!");
            }

            if (!Regex.IsMatch(password, @"[a-z]"))
            {
                return new ValidationResult("Mật khẩu phải có ít nhất 1 chữ cái viết thường!");
            }

            if (!Regex.IsMatch(password, @"[0-9]"))
            {
                return new ValidationResult("Mật khẩu phải có ít nhất 1 chữ số!");
            }

            if (!Regex.IsMatch(password, @"[\W_]"))
            {
                return new ValidationResult("Mật khẩu phải có ít nhất 1 ký tự đặc biệt!");
            }

            return ValidationResult.Success;
        }
    }
}
