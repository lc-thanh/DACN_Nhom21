using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using LibraryManagerApp.Data.Pagination;
using LibraryManagerApp.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Writers;
using Microsoft.VisualBasic;
using System;
using System.Linq.Expressions;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class MemberController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserService _userService;

        public MemberController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userService = new UserService();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(Guid id)
        {
            var membersQuery = _unitOfWork.MemberRepository.GetQueryFullInfors();
            MemberViewModel? member = await membersQuery.Select(m => new MemberViewModel
            {
                Id = m.Id,
                FullName = m.FullName,
                IndividualId = m.IndividualId,
                Phone = m.Phone,
                Email = m.Email,
                Address = m.Address,
                DateOfBirth = m.DateOfBirth,
                CreatedOn = m.CreatedOn,
                LoansCount = m.Loans.Count,
                Status = m.Status,
                isLocked = m.isLocked,
            }).FirstOrDefaultAsync(m => m.Id.Equals(id));

            if (member == null)
            {
                return NotFound(new { message = "Không tìm thấy thành viên!" });
            }
            return Ok(member);
        }

        [HttpGet]
        public async Task<IActionResult> GetMembers(
            [FromQuery] string? searchString = "",
            [FromQuery] string? orderBy = "",
            [FromQuery] List<MemberStatus>? statusFilter = null,
            [FromQuery] bool? isLocked = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var membersQuery = _unitOfWork.MemberRepository.GetQueryFullInfors();

            var memberViewModel = membersQuery.Select(m => new MemberViewModel
            {
                Id = m.Id,
                FullName = m.FullName,
                IndividualId = m.IndividualId,
                Phone = m.Phone,
                Email = m.Email,
                Address = m.Address,
                DateOfBirth = m.DateOfBirth,
                CreatedOn = m.CreatedOn,
                LoansCount = m.Loans.Count,
                Status = m.Status,
                isLocked = m.isLocked,
            });

            List<Expression<Func<MemberViewModel, bool>>> filterList = new List<Expression<Func<MemberViewModel, bool>>>();
            if (!string.IsNullOrEmpty(searchString))
            {
                filterList.Add(m =>
                    m.FullName.ToLower().Contains(searchString.ToLower()) ||
                    m.IndividualId.Contains(searchString.ToLower()) ||
                    m.Phone.Contains(searchString.ToLower()) ||
                    ((!string.IsNullOrEmpty(m.Email)) ? (m.Email.ToLower().Contains(searchString.ToLower())) : false) ||
                    ((!string.IsNullOrEmpty(m.Address)) ? (m.Address.ToLower().Contains(searchString.ToLower())) : false)
                );
            }
            if (statusFilter != null)
            {
                if (statusFilter.Count() > 0)
                {
                    filterList.Add(m => statusFilter.Contains(m.Status));
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

            Func<IQueryable<MemberViewModel>, IOrderedQueryable<MemberViewModel>>? orderFunc = null;

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

            PaginatedResult<MemberViewModel> paginatedBooks = await _unitOfWork.BaseRepository<MemberViewModel>().GetPaginatedAsync(
                memberViewModel,
                filterList,
                orderFunc,
                "",
                page,
                pageSize
            );

            return Ok(paginatedBooks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMember([FromBody] MemberCreateModel memberDto)
        {
            var phoneCheck = await _unitOfWork.UserRepository.GetByPhoneAsync(memberDto.Phone);
            if (phoneCheck != null)
            {
                return StatusCode(422, new
                {
                    message = "Đã tồn tại số điện thoại này!",
                    field = "phone"
                });
            }

            var idCheck = await _unitOfWork.MemberRepository.GetByIndividualIdAsync(memberDto.IndividualId);
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
                FullName = memberDto.FullName,
                Email = memberDto.Email,
                Phone = memberDto.Phone,
                IndividualId = memberDto.IndividualId,
                Password = _userService.HashPassword("Abc123!@#"),
                Role = RoleEnum.Member,
            };

            _unitOfWork.MemberRepository.Add(memberToCreate);

            var saved = await _unitOfWork.SaveChangesAsync();

            if (saved > 0)
            {
                return Ok(new { message = "Tạo thành viên mới thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(Guid id, [FromBody] MemberCreateModel memberDto)
        {
            var memberToUpdate = await _unitOfWork.MemberRepository.GetByIdAsync(id);
            if (memberToUpdate == null)
                return NotFound(new { message = "Không tìm thấy thành viên!" });

            if (memberToUpdate.Phone != memberDto.Phone)
            {
                var phoneCheck = await _unitOfWork.UserRepository.GetByPhoneAsync(memberDto.Phone);
                if (phoneCheck != null)
                {
                    return StatusCode(422, new
                    {
                        message = "Đã tồn tại số điện thoại này!",
                        field = "phone"
                    });
                }
                memberToUpdate.Phone = memberDto.Phone;
            }

            if (memberToUpdate.IndividualId != memberDto.IndividualId)
            {
                var idCheck = await _unitOfWork.MemberRepository.GetByIndividualIdAsync(memberDto.IndividualId);
                if (idCheck != null)
                {
                    return StatusCode(422, new
                    {
                        message = "Đã tồn tại mã sinh viên/giảng viên này!",
                        field = "individualId"
                    });
                }
                memberToUpdate.IndividualId = memberDto.IndividualId;
            }


            memberToUpdate.FullName = memberDto.FullName;
            memberToUpdate.Email = memberDto.Email;

            _unitOfWork.MemberRepository.Update(memberToUpdate);

            var saved = await _unitOfWork.SaveChangesAsync();

            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật thành viên thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(Guid id)
        {
            var member = await _unitOfWork.MemberRepository.GetByIdAsync(id);
            if (member == null)
                return NotFound(new { message = "Không tìm thấy thành viên!" });

            _unitOfWork.MemberRepository.Delete(member);

            var saved = await _unitOfWork.SaveChangesAsync();

            if (saved > 0)
            {
                return Ok(new { message = "Xóa thành viên thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpGet("find-by-phone/{phone}")]
        public async Task<IActionResult> FindByPhone(string phone)
        {
            var membersQuery = _unitOfWork.MemberRepository.GetQueryFullInfors();

            var member = await membersQuery.Select(m => new MemberViewModel
            {
                Id = m.Id,
                FullName = m.FullName,
                IndividualId = m.IndividualId,
                Phone = m.Phone,
                Email = m.Email,
                Address = m.Address,
                DateOfBirth = m.DateOfBirth,
                CreatedOn = m.CreatedOn,
                LoansCount = m.Loans.Count,
                Status = m.Status,
                isLocked = m.isLocked,
            }).FirstOrDefaultAsync(mem => mem.Phone.Equals(phone));

            if ( member == null )
                return NotFound(new { message = "Không tìm thấy thành viên!" });

            return Ok(member);
        }
    }
}
