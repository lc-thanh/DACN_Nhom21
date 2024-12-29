using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class StatisticController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public StatisticController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("loan-count-by-status")]
        public async Task<IActionResult> GetTotalLoansCount()
        {
            // Lấy tất cả dữ liệu cần thiết một lần
            var loans = await _unitOfWork.LoanRepository.GetAllAsync();

            // Khởi tạo các biến đếm
            int totalLoans = loans.Count();
            int pendingLoans = 0;
            int approvedLoans = 0;
            int onLoansCount = 0;
            int overDueLoans = 0;

            // Duyệt qua các phiếu mượn và đếm
            foreach (var loan in loans)
            {
                switch (loan.Status)
                {
                    case StatusEnum.Pending:
                        pendingLoans++;
                        break;
                    case StatusEnum.Approved:
                        approvedLoans++;
                        break;
                    case StatusEnum.OnLoan:
                        onLoansCount++;
                        break;
                    case StatusEnum.Overdue:
                        overDueLoans++;
                        break;
                    default:
                        break;
                }
            }

            return Ok(new LoanStatisticModel
            {
                totalLoans = totalLoans,
                pendingLoans = pendingLoans,
                approvedLoans = approvedLoans,
                onLoansCount = onLoansCount,
                overDueLoans = overDueLoans
            });
        }

        [HttpGet("loan-count-by-months")]
        public async Task<IActionResult> GetLoansCountByMonths()
        {
            // Lấy thời gian hiện tại và mốc 6 tháng trước
            var now = DateTime.Now;
            var sixMonthsAgo = now.AddMonths(-6);

            // Truy vấn cơ sở dữ liệu
            var statistics = await _unitOfWork.Context.Loans
                .Where(loan => loan.LoanDate >= sixMonthsAgo) // Lọc các phiếu mượn trong 6 tháng gần nhất
                .GroupBy(loan => new { loan.LoanDate.Year, loan.LoanDate.Month }) // Nhóm theo năm và tháng
                .Select(group => new LoansCountByMonthModel
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    TotalLoans = group.Count(), // Tổng số phiếu mượn trong tháng
                    OverdueLoans = group.Count(loan => (loan.ReturnedDate != null) ? (loan.ReturnedDate > loan.DueDate) : (now > loan.DueDate)) // Số phiếu bị Overdue
                })
                .OrderBy(stat => stat.Year)
                .ThenBy(stat => stat.Month)
                .ToListAsync();

            return Ok(statistics);
        }

        [HttpGet("user-actions")]
        public async Task<IActionResult> GetUserActions()
        {
            var userActions = await _unitOfWork.Context.UserActions
                .OrderByDescending(ua => ua.Timestamp)
                .Take(10)
                .Include(ua => ua.User)
                .Select(ua => new UserActionsViewModel()
                {
                    Id = ua.Id,
                    UserId = ua.UserId,
                    FullName = ua.User.FullName,
                    ActionName = ua.ActionName,
                    Timestamp = ua.Timestamp,
                })
                .ToListAsync();

            return Ok(userActions);
        }
    }
}
