using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using LibraryManagerApp.Data.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class DepositTransactionController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public DepositTransactionController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetTransactions(
            [FromQuery] string? searchString,
            [FromQuery] string? timePeriod,
            [FromQuery] TransactionType? typeFilter,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {
            var transactionQuery = _unitOfWork.Context.DepositTransactions
                .Include(dt => dt.Librarian)
                .Include(dt => dt.Member)
                .Select(dt => new TransactionViewModel()
                {
                    Id = dt.Id,
                    Amount = dt.Amount,
                    TransactionType = dt.TransactionType,
                    Description = dt.Description,
                    MemberId = dt.MemberId,
                    MemberFullName = (dt.Member != null) ? (dt.Member.FullName) : null,
                    LibrarianId = dt.LibrarianId,
                    LibrarianFullName = dt.Librarian.FullName,
                    Timestamp = dt.Timestamp,
                });

            List<Expression<Func<TransactionViewModel, bool>>> filterList = new List<Expression<Func<TransactionViewModel, bool>>>();
            if (!string.IsNullOrEmpty(searchString))
            {
                filterList.Add(dt =>
                    dt.LibrarianFullName.ToLower().Contains(searchString.ToLower()) ||
                    ((dt.MemberFullName != null) ? dt.MemberFullName.ToLower().Contains(searchString.ToLower()) : false) ||
                    dt.Description.ToLower().Contains(searchString.ToLower())
                );
            }
            if (!string.IsNullOrEmpty(timePeriod))
            {
                DateTime.TryParse(timePeriod.Split('-')[0], out DateTime dateStart);

                DateTime.TryParse(timePeriod.Split('-')[1], out DateTime dateEnd);

                filterList.Add(dt => dateStart <= dt.Timestamp && dt.Timestamp <= dateEnd);
            }
            if (typeFilter != null)
            {
                filterList.Add(dt => dt.TransactionType == typeFilter);
            }


            Func<IQueryable<TransactionViewModel>, IOrderedQueryable<TransactionViewModel>>? orderFunc = null;
            orderFunc = query => query.OrderByDescending(dt => dt.Timestamp);


            PaginatedResult<TransactionViewModel> paginatedLoans = await _unitOfWork.BaseRepository<TransactionViewModel>().GetPaginatedAsync(
                transactionQuery,
                filterList,
                orderFunc,
                "",
                page,
                pageSize
            );

            return Ok(paginatedLoans);

        }

        [HttpGet("total-amount")]
        public async Task<IActionResult> GetTotalAmount()
        {
            var totalFund = await _unitOfWork.Context.DepositTransactions
                              .SumAsync(t => t.TransactionType == TransactionType.DepositIn || t.TransactionType == TransactionType.WithdrawIn
                                        ? t.Amount
                                        : -t.Amount);
            var totalCount = await _unitOfWork.Context.DepositTransactions.CountAsync();
            return Ok(new { totalFund, totalCount });
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpPost("withdraw-in")]
        public async Task<IActionResult> WithdrawIn([FromBody] TransactionCreateModel transDto)
        {
            string librarianPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var librarian = await _unitOfWork.UserRepository.GetByPhoneAsync(librarianPhone);

            _unitOfWork.Context.UserActions.Add(new UserAction()
            {
                UserId = librarian.Id,
                ActionName = $"đã thêm {transDto.Amount}đ vào quỹ",
                Timestamp = DateTime.Now,
            });

            _unitOfWork.Context.DepositTransactions.Add(new DepositTransaction()
            {
                Amount = transDto.Amount,
                Description = transDto.Description,
                LibrarianId = librarian.Id,
                TransactionType = TransactionType.WithdrawIn,
                Timestamp = DateTime.Now,
            });

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Thêm tiền vào thành công!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpPost("withdraw-out")]
        public async Task<IActionResult> WithdrawOut([FromBody] TransactionCreateModel transDto)
        {
            string librarianPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var librarian = await _unitOfWork.UserRepository.GetByPhoneAsync(librarianPhone);

            _unitOfWork.Context.UserActions.Add(new UserAction()
            {
                UserId = librarian.Id,
                ActionName = $"đã rút {transDto.Amount}đ trong quỹ",
                Timestamp = DateTime.Now,
            });

            _unitOfWork.Context.DepositTransactions.Add(new DepositTransaction()
            {
                Amount = transDto.Amount,
                Description = transDto.Description,
                LibrarianId = librarian.Id,
                TransactionType = TransactionType.WithdrawOut,
                Timestamp = DateTime.Now,
            });

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Rút tiền ra thành công!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }
    }
}
