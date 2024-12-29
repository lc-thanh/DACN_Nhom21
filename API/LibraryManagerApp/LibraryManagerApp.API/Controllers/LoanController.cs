using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Enum;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using LibraryManagerApp.Data.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Linq.Expressions;
using System.Security.Claims;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class LoanController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public LoanController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        private static IList<string>? generateLoanWarning(StatusEnum status, List<Book> bookList) 
        {
            if (status != StatusEnum.Pending && status != StatusEnum.Approved)
                return null;

            List<string>? loanWarning = new List<string>();

            foreach (Book book in bookList)
            {
                if (book.AvailableQuantity == 0)
                    loanWarning.Add($"Sách {book.Title} đang hết");
            }

            if (loanWarning.Count > 0)
                return loanWarning;
            return null;
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpGet]
        public async Task<IActionResult> GetLoans(
            [FromQuery] string? searchString,
            [FromQuery] string? loanDateTimePeriod,
            [FromQuery] StatusEnum? statusFilter,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {
            var loansQuery = _unitOfWork.LoanRepository.GetAllInforsQuery();

            var loanViewModels = loansQuery.Select(l => new LoanViewModel
            {
                Id = l.Id,
                LoanCode = l.LoanCode,
                LoanDate = l.LoanDate,
                DueDate = l.DueDate,
                ReturnedDate = l.ReturnedDate,
                Status = l.Status,
                MemberId = l.MemberId,
                MemberPhone = l.Member.Phone,
                MemberFullName = l.Member.FullName,
                LibrarianId = l.LibrarianId,
                LibrarianFullName = l.Librarian.FullName,
                BookNames = l.LoanDetails.Select(ld => ld.Book.Title).ToList(),
                Warning = generateLoanWarning(l.Status, l.LoanDetails.Select(ld => ld.Book).ToList()),
            });


            List<Expression<Func<LoanViewModel, bool>>> filterList = new List<Expression<Func<LoanViewModel, bool>>>();
            if (!string.IsNullOrEmpty(searchString))
            {
                filterList.Add(l =>
                    l.MemberFullName.ToLower().Contains(searchString.ToLower()) ||
                    ((l.LibrarianFullName != null) ? l.LibrarianFullName.ToLower().Contains(searchString.ToLower()) : false) ||
                    l.LoanCode.ToLower().Contains(searchString.ToLower()) ||
                    l.MemberPhone.Contains(searchString)
                );
            }
            if (!string.IsNullOrEmpty(loanDateTimePeriod))
            {
                DateTime.TryParse(loanDateTimePeriod.Split('-')[0], out DateTime dateStart);

                DateTime.TryParse(loanDateTimePeriod.Split('-')[1], out DateTime dateEnd);

                filterList.Add(l => dateStart <= l.LoanDate && l.LoanDate <= dateEnd);
            }
            if (statusFilter != null)
            {
                filterList.Add(l => l.Status == statusFilter);
            }


            Func<IQueryable<LoanViewModel>, IOrderedQueryable<LoanViewModel>>? orderFunc = null;

            // Mặc định là xếp theo LoanDate mới nhất
            orderFunc = query => query.OrderByDescending(l => l.LoanDate);


            PaginatedResult<LoanViewModel> paginatedLoans = await _unitOfWork.BaseRepository<LoanViewModel>().GetPaginatedAsync(
                loanViewModels,
                filterList,
                orderFunc,
                "",
                page,
                pageSize
            );

            return Ok(paginatedLoans);
        }

        [Authorize(Roles = "Librarian,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateLoan([FromBody] LoanCreateModel loanDto)
        {
            // Find member
            var member = await _unitOfWork.MemberRepository.GetByPhoneAsync(loanDto.MemberPhone);
            if (member == null)
                return NotFound(new { message = "Không tìm thấy người dùng với số điện thoại đã cho!" });

            // Get Librarian created this Loan
            string librarianPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var librarian = await _unitOfWork.UserRepository.GetByPhoneAsync(librarianPhone);

            string loanCode = _unitOfWork.LoanRepository.GenerateLoanCode();
            while (await _unitOfWork.LoanRepository.FindByCodeAsync(loanCode) != null)
            {
                loanCode = _unitOfWork.LoanRepository.GenerateLoanCode();
            }

            if (loanDto.DueDate <  DateTime.Now) 
            {
                return BadRequest(new { message = "Thời gian không hợp lệ!" });
            }

            DateTime dueDate = new DateTime(loanDto.DueDate.Year, loanDto.DueDate.Month, loanDto.DueDate.Day, 23, 59, 0);

            var loan = new Loan
            {
                Status = StatusEnum.OnLoan,
                MemberId = member.Id,
                LibrarianId = librarian.Id,
                LoanDate = DateTime.Now,
                DueDate = dueDate,
                LoanCode = loanCode,
            };

            int deposit = 0;
            foreach (var bookString in loanDto.BookIdAndQuantity)
            {
                Guid bookId = new Guid(bookString.Split('#')[0]);
                int quantity;

                if (!Int32.TryParse(bookString.Split('#')[1], out quantity))
                {
                    return BadRequest(new { message = "Đầu vào không hợp lệ!" });
                }

                var book = await _unitOfWork.BookRepository.GetByIdAsync(bookId);
                if (book == null)
                    { return BadRequest(new { message = "Không tìm thấy sách!" }); }
                if (book.AvailableQuantity == 0)
                    { return BadRequest(new { message = "Có sách đang hết!" }); }

                var loanDetail = new LoanDetail
                {
                    Book = book,
                    Loan = loan,
                    Quantity = quantity
                };

                book.AvailableQuantity = book.AvailableQuantity - quantity;
                deposit += (book.Price * quantity);
                _unitOfWork.BookRepository.Update(book);
                _unitOfWork.LoanDetailRepository.Add(loanDetail);
            }

            loan.Deposit = deposit;
            _unitOfWork.Context.DepositTransactions.Add(new DepositTransaction()
            {
                Amount = deposit,
                TransactionType = TransactionType.DepositIn,
                UserId = member.Id,
                Description = "đã cọc phiếu " + loanCode,
                Timestamp = loan.LoanDate,
            });

            _unitOfWork.LoanRepository.Add(loan);

            if (member.Status != MemberStatus.Overdue)
                member.Status = MemberStatus.OnLoan;
            _unitOfWork.MemberRepository.Update(member);

            _unitOfWork.Context.UserActions.Add(new UserAction()
            {
                UserId = librarian.Id,
                ActionName = "đã tạo phiếu mượn " + loanCode,
                Timestamp = DateTime.Now,
            });

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Tạo phiếu mượn thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpPost("{loanId}/return-book")]
        public async Task<IActionResult> ReturnBooks(Guid loanId)
        {
            string librarianPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var librarian = await _unitOfWork.UserRepository.GetByPhoneAsync(librarianPhone);

            var loan = await _unitOfWork.LoanRepository.GetAllInforsQuery().FirstOrDefaultAsync(l => l.Id == loanId);
            if (loan == null)
                return BadRequest(new { message = "Không tìm thấy phiếu!" });

            if (loan.Status != StatusEnum.OnLoan && loan.Status != StatusEnum.Overdue)
                return BadRequest(new { message = "Trạng thái phiếu không hợp lệ!" });

            loan.Status = StatusEnum.Returned;
            loan.ReturnedDate = DateTime.Now;
            _unitOfWork.LoanRepository.Update(loan);

            foreach (var detail in loan.LoanDetails)
            {
                var book = await _unitOfWork.BookRepository.GetByIdAsync(detail.BookId);
                if (book != null)
                {
                    book.AvailableQuantity += detail.Quantity;
                    _unitOfWork.BookRepository.Update(book);
                }
            }

            // Cập nhật lại member status về Normal nếu đang không còn mượn phiếu nào
            int? memberOnLoansCount = await _unitOfWork.MemberRepository.OnLoansCount(loan.MemberId);
            if (memberOnLoansCount != null)
                if (memberOnLoansCount == 0)
                    loan.Member.Status = MemberStatus.Normal;
            _unitOfWork.MemberRepository.Update(loan.Member);

            _unitOfWork.Context.DepositTransactions.Add(new DepositTransaction()
            {
                Amount = loan.Deposit,
                TransactionType = TransactionType.DepositOut,
                UserId = loan.MemberId,
                Description = "đã trả cọc phiếu " + loan.LoanCode,
                Timestamp = DateTime.Now,
            });

            _unitOfWork.Context.UserActions.Add(new UserAction()
            {
                UserId = librarian.Id,
                ActionName = "đã xác nhận trả phiếu " + loan.LoanCode,
                Timestamp = DateTime.Now,
            });

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Đã trả sách!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpDelete("{loanId}")]
        public async Task<IActionResult> DeleteLoan(Guid loanId)
        {
            var loan = await _unitOfWork.LoanRepository.GetAllInforsQuery().FirstOrDefaultAsync(l => l.Id == loanId);
            if (loan == null)
                return BadRequest(new { message = "Không tìm thấy phiếu!" });

            if (loan.Status != StatusEnum.Returned)
                return BadRequest(new { message = "Trạng thái phiếu không hợp lệ!" });

            _unitOfWork.LoanRepository.Delete(loan);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Đã xóa phiếu mượn!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpPost("{loanId}/approve")]
        public async Task<IActionResult> ApproveLoan(Guid loanId)
        {
            string librarianPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var librarian = await _unitOfWork.UserRepository.GetByPhoneAsync(librarianPhone);

            var loan = await _unitOfWork.LoanRepository.GetAllInforsQuery().FirstOrDefaultAsync(l => l.Id == loanId);
            if (loan == null)
                return BadRequest(new { message = "Không tìm thấy phiếu!" });

            if (loan.Status != StatusEnum.Pending)
                return BadRequest(new { message = "Trạng thái phiếu không hợp lệ!" });

            loan.Status = StatusEnum.Approved;
            loan.LibrarianId = librarian.Id;
            _unitOfWork.LoanRepository.Update(loan);

            _unitOfWork.Context.UserActions.Add(new UserAction()
            {
                UserId = librarian.Id,
                ActionName = "đã tiếp nhận phiếu " + loan.LoanCode,
                Timestamp = DateTime.Now,
            });

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Đã tiếp nhận phiếu!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpPost("{loanId}/onloan")]
        public async Task<IActionResult> ApprovedToOnLoan(Guid loanId)
        {
            string librarianPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var librarian = await _unitOfWork.UserRepository.GetByPhoneAsync(librarianPhone);

            var loan = await _unitOfWork.LoanRepository.GetAllInforsQuery().FirstOrDefaultAsync(l => l.Id == loanId);
            if (loan == null)
                return BadRequest(new { message = "Không tìm thấy phiếu!" });

            if (loan.Status != StatusEnum.Approved)
                return BadRequest(new { message = "Trạng thái phiếu không hợp lệ!" });

            loan.Status = StatusEnum.OnLoan;
            loan.LibrarianId = librarian.Id;
            _unitOfWork.LoanRepository.Update(loan);

            foreach (var detail in loan.LoanDetails)
            {
                var book = await _unitOfWork.BookRepository.GetByIdAsync(detail.BookId);
                if (book.AvailableQuantity == 0)
                { return BadRequest(new { message = "Có sách đang hết!" }); }

                book.AvailableQuantity -= detail.Quantity;
                _unitOfWork.BookRepository.Update(book);
            }

            if (loan.Member.Status != MemberStatus.Overdue)
                loan.Member.Status = MemberStatus.OnLoan;
            _unitOfWork.MemberRepository.Update(loan.Member);

            _unitOfWork.Context.DepositTransactions.Add(new DepositTransaction()
            {
                Amount = loan.Deposit,
                TransactionType = TransactionType.DepositIn,
                UserId = loan.MemberId,
                Description = "đã cọc phiếu " + loan.LoanCode,
                Timestamp = loan.LoanDate,
            });

            _unitOfWork.Context.UserActions.Add(new UserAction()
            {
                UserId = librarian.Id,
                ActionName = "đã tạo phiếu mượn " + loan.LoanCode,
                Timestamp = DateTime.Now,
            });

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Đã tạo phiếu mượn!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Member")]
        [HttpGet("member")]
        public async Task<IActionResult> MemberGetLoans(
            [FromQuery] string? searchString,
            [FromQuery] string? loanDateTimePeriod,
            [FromQuery] StatusEnum? statusFilter,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {
            string memberPhone = User.FindFirst(ClaimTypes.Name)?.Value;

            var loansQuery = _unitOfWork.LoanRepository.GetAllInforsQueryByMemberPhone(memberPhone);

            var loanViewModels = loansQuery.Select(l => new LoanViewModel
            {
                Id = l.Id,
                LoanCode = l.LoanCode,
                LoanDate = l.LoanDate,
                DueDate = l.DueDate,    
                ReturnedDate = l.ReturnedDate,
                Status = l.Status,
                MemberId = l.MemberId,
                MemberPhone = l.Member.Phone,
                MemberFullName = l.Member.FullName,
                LibrarianId = l.LibrarianId,
                LibrarianFullName = (l.LibrarianId != null) ? l.Librarian.FullName : null,
                BookNames = l.LoanDetails.Select(ld => ld.Book.Title).ToList(),
                Warning = l.Status.Equals(StatusEnum.Pending) ? generateLoanWarning(l.Status, l.LoanDetails.Select(ld => ld.Book).ToList()) : null
            });


            List<Expression<Func<LoanViewModel, bool>>> filterList = new List<Expression<Func<LoanViewModel, bool>>>();
            if (!string.IsNullOrEmpty(searchString))
            {
                filterList.Add(l =>
                    l.MemberFullName.ToLower().Contains(searchString.ToLower()) ||
                    ((l.LibrarianFullName != null) ? l.LibrarianFullName.ToLower().Contains(searchString.ToLower()) : false) ||
                    l.LoanCode.ToLower().Contains(searchString.ToLower()) ||
                    l.MemberPhone.Contains(searchString)
                );
            }
            if (!string.IsNullOrEmpty(loanDateTimePeriod))
            {
                DateTime.TryParse(loanDateTimePeriod.Split('-')[0], out DateTime dateStart);

                DateTime.TryParse(loanDateTimePeriod.Split('-')[1], out DateTime dateEnd);

                filterList.Add(l => dateStart <= l.LoanDate && l.LoanDate <= dateEnd);
            }
            if (statusFilter != null)
            {
                filterList.Add(l => l.Status == statusFilter);
            }


            Func<IQueryable<LoanViewModel>, IOrderedQueryable<LoanViewModel>>? orderFunc = null;

            // Mặc định là xếp theo LoanDate mới nhất
            orderFunc = query => query.OrderByDescending(l => l.LoanDate);


            PaginatedResult<LoanViewModel> paginatedLoans = await _unitOfWork.BaseRepository<LoanViewModel>().GetPaginatedAsync(
                loanViewModels,
                filterList,
                orderFunc,
                "",
                page,
                pageSize
            );

            return Ok(paginatedLoans);
        }

        [Authorize(Roles = "Member")]
        [HttpPost("member")]
        public async Task<IActionResult> MemberCreateLoan([FromBody] LoanMemberCreateModel loanDto)
        {
            // Get Librarian created this Loan
            string memberPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var member = await _unitOfWork.UserRepository.GetByPhoneAsync(memberPhone);

            string loanCode = _unitOfWork.LoanRepository.GenerateLoanCode();
            while (await _unitOfWork.LoanRepository.FindByCodeAsync(loanCode) != null)
            {
                loanCode = _unitOfWork.LoanRepository.GenerateLoanCode();
            }

            if (loanDto.DueDate < loanDto.LoanDate)
            {
                return BadRequest(new { message = "Thời gian không hợp lệ!" });
            }

            DateTime dueDate = new DateTime(loanDto.DueDate.Year, loanDto.DueDate.Month, loanDto.DueDate.Day, 23, 59, 0);

            var loan = new Loan
            {
                Status = StatusEnum.Pending,
                MemberId = member.Id,
                LoanDate = loanDto.LoanDate,
                DueDate = dueDate,
                LoanCode = loanCode,
            };

            int deposit = 0;
            foreach (var bookString in loanDto.BookIdAndQuantity)
            {
                Guid bookId = new Guid(bookString.Split('#')[0]);
                int quantity;

                if (!Int32.TryParse(bookString.Split('#')[1], out quantity))
                {
                    return BadRequest(new { message = "Đầu vào không hợp lệ!" });
                }

                var book = await _unitOfWork.BookRepository.GetByIdAsync(bookId);
                if (book == null)
                { return BadRequest(new { message = "Không tìm thấy sách!" }); }

                var loanDetail = new LoanDetail
                {
                    Book = book,
                    Loan = loan,
                    Quantity = quantity
                };

                deposit += (book.Price * quantity);
                _unitOfWork.LoanDetailRepository.Add(loanDetail);
            }

            loan.Deposit = deposit;
            _unitOfWork.LoanRepository.Add(loan);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Yêu cầu phiếu mượn thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [Authorize(Roles = "Member")]
        [HttpDelete("member/{loanId}")]
        public async Task<IActionResult> MemberDeleteLoan(Guid loanId)
        {
            string memberPhone = User.FindFirst(ClaimTypes.Name)?.Value;
            var member = await _unitOfWork.UserRepository.GetByPhoneAsync(memberPhone);

            var loan = await _unitOfWork.LoanRepository.GetAllInforsQuery().FirstOrDefaultAsync(l => l.Id == loanId);
            if (loan == null)
                return BadRequest(new { message = "Không tìm thấy phiếu!" });

            if (loan.Status != StatusEnum.Pending && loan.Status != StatusEnum.Approved)
                return BadRequest(new { message = "Trạng thái phiếu không hợp lệ!" });

            _unitOfWork.LoanRepository.Delete(loan);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
                return Ok(new { message = "Đã xóa phiếu mượn!" });

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }
    }
}
