using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using LibraryManagerApp.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;

        public AuthController(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _userService = new UserService();
        }

        //Tham khảo: https://www.c-sharpcorner.com/article/jwt-authentication-with-refresh-tokens-in-net-6-0/

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin login)
        {
            if (login == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user with provided Phone
            var user = await _unitOfWork.UserRepository.GetByPhoneAsync(login.Phone);

            if (user == null)
            {
                return StatusCode(422, new { message = "Số điện thoại không tồn tại!", field = "phone" });
            }

            // Check password
            if (!_userService.VerifyPassword(user.Password, login.Password))
            {
                return StatusCode(422, new { message = "Mật khẩu không chính xác!", field = "password" });
            }

            if (user.isLocked)
            {
                return StatusCode(423, new { message = "Tài khoản đã bị khóa, vui lòng liên hệ thư viện để biết thêm thông tin..." });
            }

            JwtSecurityToken token;
            // Check Role
            switch (user.Role)
            {
                case Data.Enum.RoleEnum.Admin:
                    {
                        token = GenerateJwtToken(user.Phone, "Admin");
                        break;
                    }

                case Data.Enum.RoleEnum.Librarian:
                    {
                        token = GenerateJwtToken(user.Phone, "Librarian");
                        break;
                    }

                case Data.Enum.RoleEnum.Member:
                    {
                        token = GenerateJwtToken(user.Phone, "Member");
                        break;
                    }

                default:
                    return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
            }

            var refreshToken = GenerateRefreshToken();
            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            UserToken newUserToken = new UserToken
            {
                UserId = user.Id,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.Now.AddDays(refreshTokenValidityInDays),
                CreatedAt = DateTime.Now,
            };
            _unitOfWork.UserTokenRepository.Add(newUserToken);
            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new
                {
                    data = new
                    {
                        AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                        RefreshToken = refreshToken,
                        ExpiresAt = token.ValidTo,
                    },
                    message = "Đăng nhập thành công!"
                });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] UserSignUp signUp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu đầu vào chưa đúng!",
                    ModelState
                });
            }

            if (!signUp.Password.Equals(signUp.ConfirmPassword))
            {
                return BadRequest(new
                {
                    message = "Xác nhận mật khẩu chưa đúng!",
                    field = "confirmPassword"
                });
            }

            var phoneCheck = await _unitOfWork.UserRepository.GetByPhoneAsync(signUp.Phone);
            if (phoneCheck != null)
            {
                return StatusCode(422, new
                {
                    message = "Đã tồn tại số điện thoại này!",
                    field = "phone"
                });
            }

            var idCheck = await _unitOfWork.MemberRepository.GetByIndividualIdAsync(signUp.IndividualId);
            if (idCheck != null)
            {
                return StatusCode(422, new
                {
                    message = "Đã tồn tại mã sinh viên/giảng viên này!",
                    field = "individualId"
                });
            }

            Member memberToCreate = new Member
            {
                FullName = signUp.FullName,
                Email = signUp.Email,
                Phone = signUp.Phone,
                IndividualId = signUp.IndividualId,
                Password = _userService.HashPassword(signUp.Password),
                Role = Data.Enum.RoleEnum.Member,
            };

            _unitOfWork.MemberRepository.Add(memberToCreate);

            var saved_signup = await _unitOfWork.SaveChangesAsync();

            if (saved_signup > 0)
            {
                User userLogin = await _unitOfWork.UserRepository.GetByPhoneAsync(memberToCreate.Phone);
                JwtSecurityToken token = GenerateJwtToken(memberToCreate.Phone, "Member");
                var refreshToken = GenerateRefreshToken();
                _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
                UserToken newUserToken = new UserToken
                {
                    UserId = userLogin.Id,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.Now.AddDays(refreshTokenValidityInDays),
                    CreatedAt = DateTime.Now,
                };
                _unitOfWork.UserTokenRepository.Add(newUserToken);
                var saved_login = await _unitOfWork.SaveChangesAsync();
                if (saved_login > 0)
                    return Ok(new
                    {
                        data = new
                        {
                            AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                            RefreshToken = refreshToken,
                            ExpiresAt = token.ValidTo
                        },
                        message = "Đăng ký tài khoản mới thành công!"
                    });

                return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] string refreshToken)
        {
            if (refreshToken.Length != 88)
            {
                return BadRequest(new { message = "Đầu vào không hợp lệ!" });
            }

            UserToken? userToken = await _unitOfWork.UserTokenRepository.GetByRefreshToken(refreshToken);
            if (userToken == null)
                return BadRequest(new { message = "Token không hợp lệ!" });

            string userPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            if (!userToken.User.Phone.Equals(userPhone))
                return Unauthorized(new { message = "Token không hợp lệ!" });

            _unitOfWork.UserTokenRepository.Delete(userToken);
            int saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Đăng xuất thành công!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        private JwtSecurityToken GenerateJwtToken(string userPhone, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            _ = int.TryParse(_configuration["JWT:AccessTokenValidityInMinutes"], out int tokenValidityInMinutes);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, userPhone),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, role) // Thêm role vào claims
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                signingCredentials: credentials
            );

            return token;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetPersonalInformation()
        {
            // Get User
            string userPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            string userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            switch (userRole)
            {
                case "Member":
                    {
                        var member = await _unitOfWork.MemberRepository.GetByPhoneAsync(userPhone);

                        return Ok(new
                        {
                            member.FullName,
                            member.Phone,
                            member.IndividualId,
                            member.Email,
                            member.Address,
                            member.DateOfBirth,
                        });
                    }

                case "Admin":
                    {
                        var admin = await _unitOfWork.AdminRepository.GetByPhoneAsync(userPhone);

                        return Ok(new
                        {
                            FullName = admin.FullName,
                            Phone = admin.Phone,
                            Email = admin.Email,
                            Address = admin.Address,
                            DateOfBirth = admin.DateOfBirth,
                        });
                    }

                case "Librarian":
                    {
                        var librarian = await _unitOfWork.LibrarianRepository.GetByPhoneAsync(userPhone);

                        return Ok(new
                        {
                            FullName = librarian.FullName,
                            Phone = librarian.Phone,
                            Email = librarian.Email,
                            Address = librarian.Address,
                            DateOfBirth = librarian.DateOfBirth,
                        });
                    }

                default:
                    return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
            }
        }

        private JwtSecurityToken GenerateJwtToken(List<Claim> authClaims)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            _ = int.TryParse(_configuration["JWT:AccessTokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                claims: authClaims,
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                signingCredentials: credentials
            );

            return token;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest(new { message = "Đầu vào không hợp lệ!" });
            }

            if (!ModelState.IsValid)
                return BadRequest(new { message = "Đầu vào không hợp lệ!" });

            string accessToken = tokenModel.AccessToken;
            string refreshToken = tokenModel.RefreshToken;

            UserToken? userToken = await _unitOfWork.UserTokenRepository.GetByRefreshToken(refreshToken);
            if (userToken == null || userToken.ExpiresAt <= DateTime.Now)
            {
                await _unitOfWork.UserTokenRepository.RemoveAllExpiredTokens();
                return Unauthorized(new { message = "Token không hợp lệ!" });
            }

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return Unauthorized(new { message = "Token không hợp lệ!" });
            }

            string userPhone = principal.Identity.Name;
            var user = await _unitOfWork.UserRepository.GetByPhoneAsync(userPhone);
            if (user == null || !userToken.UserId.Equals(user.Id))
            {
                return Unauthorized(new { message = "Token không hợp lệ!" });
            }

            var newAccessToken = GenerateJwtToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();

            userToken.RefreshToken = newRefreshToken;
            _unitOfWork.UserTokenRepository.Update(userToken);
            await _unitOfWork.SaveChangesAsync();

            return new ObjectResult(new
            {
                data = new
                {
                    AccessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                    RefreshToken = newRefreshToken,
                    ExpiresAt = newAccessToken.ValidTo
                },
                message = "Làm mới token thành công!"
            });
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"])),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }
}
