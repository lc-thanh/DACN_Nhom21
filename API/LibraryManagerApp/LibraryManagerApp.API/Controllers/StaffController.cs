using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using LibraryManagerApp.Data.Pagination;
using LibraryManagerApp.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class StaffController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public StaffController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userService = new UserService();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStaff(Guid id)
        {
            var staffQuery = _unitOfWork.LibrarianRepository.GetQueryFullInfors();
            var staffViewModel = await staffQuery.Select(s => new StaffViewModel
            {
                Id = s.Id,
                FullName = s.FullName,
                Phone = s.Phone,
                Email = s.Email,
                Address = s.Address,
                DateOfBirth = s.DateOfBirth,
                CreatedOn = s.CreatedOn,
                LoansCount = s.Loans.Count,
                Role = s.Role,
                isLocked = s.isLocked,
            }).FirstOrDefaultAsync(m => m.Id.Equals(id));

            if (staffViewModel == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân sự!" });
            }
            return Ok(staffViewModel);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetStaffs(
            [FromQuery] string? searchString,
            [FromQuery] string? orderBy,
            [FromQuery] List<RoleEnum>? roleFilter = null,
            [FromQuery] bool? isLocked = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var staffQuery = _unitOfWork.LibrarianRepository.GetQueryFullInfors();

            var staffViewModel = staffQuery.Select(s => new StaffViewModel
            {
                Id = s.Id,
                FullName = s.FullName,
                Phone = s.Phone,
                Email = s.Email,
                Address = s.Address,
                DateOfBirth = s.DateOfBirth,
                CreatedOn = s.CreatedOn,
                LoansCount = s.Loans.Count,
                Role = s.Role,
                isLocked = s.isLocked,
            });

            List<Expression<Func<StaffViewModel, bool>>> filterList = new List<Expression<Func<StaffViewModel, bool>>>();
            if (!string.IsNullOrEmpty(searchString))
            {
                filterList.Add(m =>
                    m.FullName.ToLower().Contains(searchString.ToLower()) ||
                    m.Phone.Contains(searchString.ToLower()) ||
                    ((!string.IsNullOrEmpty(m.Email)) ? (m.Email.ToLower().Contains(searchString.ToLower())) : false) ||
                    ((!string.IsNullOrEmpty(m.Address)) ? (m.Address.ToLower().Contains(searchString.ToLower())) : false)
                );
            }
            if (roleFilter != null)
            {
                if (roleFilter.Count() > 0)
                {
                    filterList.Add(s => roleFilter.Contains(s.Role));
                }
            }
            if (isLocked != null)
            {
                if (isLocked == true)
                {
                    filterList.Add(m => m.isLocked);
                }
                else
                {
                    filterList.Add(m => !m.isLocked);
                }
            }

            Func<IQueryable<StaffViewModel>, IOrderedQueryable<StaffViewModel>>? orderFunc = null;

            // Mặc định là xếp theo ngày tạo
            orderFunc = query => query.OrderByDescending(m => m.CreatedOn);

            if (!string.IsNullOrEmpty(orderBy))
            {
                string orderByString = orderBy.Split('-')[0];
                string ascOrDesc = orderBy.Split("-")[1];

                switch (orderByString)
                {
                    case "FullName":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(m => m.FullName);
                        else
                            orderFunc = query => query.OrderByDescending(m => m.FullName);
                        break;

                    case "LoansCount":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(m => m.LoansCount);
                        else
                            orderFunc = query => query.OrderByDescending(m => m.LoansCount);
                        break;

                    case "CreatedOn":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(m => m.CreatedOn);
                        else
                            orderFunc = query => query.OrderByDescending(m => m.CreatedOn);
                        break;

                    default:
                        break;
                }
            }

            PaginatedResult<StaffViewModel> paginatedBooks = await _unitOfWork.BaseRepository<StaffViewModel>().GetPaginatedAsync(
                staffViewModel,
                filterList,
                orderFunc,
                "",
                page,
                pageSize
            );

            return Ok(paginatedBooks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStaff([FromBody] StaffCreateModel staffDto)
        {
            var phoneCheck = await _unitOfWork.UserRepository.GetByPhoneAsync(staffDto.Phone);
            if (phoneCheck != null)
            {
                return StatusCode(422, new
                {
                    message = "Đã tồn tại số điện thoại này!",
                    field = "phone"
                });
            }

            if (staffDto.Role == RoleEnum.Admin)
            {
                Admin adminToCreate = new Admin
                {
                    FullName = staffDto.FullName,
                    Email = staffDto.Email,
                    Phone = staffDto.Phone,
                    Password = _userService.HashPassword("Abc123!@#"),
                    Role = RoleEnum.Admin,
                };
                _unitOfWork.AdminRepository.Add(adminToCreate);
            } 
            else if (staffDto.Role == RoleEnum.Librarian)
            {
                Librarian librarianToCreate = new Librarian
                {
                    FullName = staffDto.FullName,
                    Email = staffDto.Email,
                    Phone = staffDto.Phone,
                    Password = _userService.HashPassword("Abc123!@#"),
                    Role = RoleEnum.Librarian,
                };
                _unitOfWork.LibrarianRepository.Add(librarianToCreate);
            } else
            {
                return BadRequest(new { message = "Role nhân sự không đúng!" });
            }

            var saved = await _unitOfWork.SaveChangesAsync();

            if (saved > 0)
            {
                return Ok(new { message = "Tạo nhân sự mới thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(Guid id, [FromBody] StaffUpdateModel staffDto)
        {
            var staffToUpdate = await _unitOfWork.UserRepository.GetByIdAsync(id);
            if (staffToUpdate == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân sự!" });
            }

            if (staffToUpdate.Phone != staffDto.Phone)
            {
                var phoneCheck = await _unitOfWork.UserRepository.GetByPhoneAsync(staffDto.Phone);
                if (phoneCheck != null)
                {
                    return StatusCode(422, new
                    {
                        message = "Đã tồn tại số điện thoại này!",
                        field = "phone"
                    });
                }
            }

            staffToUpdate.FullName = staffDto.FullName;
            staffToUpdate.Phone = staffDto.Phone;
            staffToUpdate.Email = staffDto.Email;

            _unitOfWork.UserRepository.Update(staffToUpdate);

            var saved = await _unitOfWork.SaveChangesAsync();

            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật nhân sự thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(Guid id)
        {
            var staff = await _unitOfWork.LibrarianRepository.GetByIdAsync(id);
            if (staff == null)
                return NotFound(new { message = "Không tìm thấy nhân sự!" });

            _unitOfWork.LibrarianRepository.Delete(staff);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Xóa nhân sự thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPost("{id}/change-role-to-librarian")]
        public async Task<IActionResult> ChangeRoleToLibrarian(Guid id)
        {
            var staffToUpdate = await _unitOfWork.AdminRepository.GetByIdAsync(id);
            if (staffToUpdate == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân sự!" });
            }
            if (staffToUpdate.Role != RoleEnum.Admin)
            {
                return BadRequest(new { message = "Role không hợp lệ!" });
            }

            staffToUpdate.Role = RoleEnum.Librarian;
            _unitOfWork.LibrarianRepository.Update(staffToUpdate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật nhân sự thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPost("{id}/change-role-to-admin")]
        public async Task<IActionResult> ChangeRoleToAdmin(Guid id)
        {
            var staffToUpdate = await _unitOfWork.LibrarianRepository.GetByIdAsync(id);
            if (staffToUpdate == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân sự!" });
            }
            if (staffToUpdate.Role != RoleEnum.Librarian)
            {
                return BadRequest(new { message = "Role không hợp lệ!" });
            }

            staffToUpdate.Role = RoleEnum.Admin;
            _unitOfWork.LibrarianRepository.Update(staffToUpdate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật nhân sự thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }


    }
}
