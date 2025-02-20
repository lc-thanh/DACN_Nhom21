using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.AspNetCore.Mvc;
using LibraryManagerApp.Data.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using LibraryManagerApp.Data.Pagination;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
//using Microsoft.AspNetCore.SignalR;
using LibraryManagerApp.API.Hubs;
using System.IO;
using System.Drawing;
using System.Collections;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class BookController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;
        //private readonly IHubContext<NotificationHub> _hubContext;

        public BookController(
            IUnitOfWork unitOfWork, 
            IWebHostEnvironment webHostEnvironment
            //IHubContext<NotificationHub> hubContext
        )
        {
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
            //_hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks(
            [FromQuery] string? searchString = "",
            [FromQuery] string? orderBy = "",
            [FromQuery] string? publishedYearRange = "",
            [FromQuery] List<Guid>? categoryIds = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var booksQuery = _unitOfWork.BookRepository.GetAllInforsQuery();

            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var bookViewModels = booksQuery.Select(b => new BookViewModel
            {
                Id = b.Id,
                Title = b.Title,
                Publisher = b.Publisher,
                PublishedYear = b.PublishedYear,
                Quantity = b.Quantity,
                AvailableQuantity = b.AvailableQuantity,
                TotalPages = b.TotalPages,
                Price = b.Price,
                ImageUrl = $"{baseUrl}/images/books/{b.ImageUrl}",
                Description = b.Description,
                AuthorName = b.AuthorName,
                CategoryId = b.CategoryId,
                CategoryName = b.Category.Name,
                BookShelfId = b.BookShelfId,
                BookShelfName = b.BookShelf.Name,
                CreatedOn = b.CreatedOn,
            });

            List<Expression<Func<BookViewModel, bool>>> filterList = new List<Expression<Func<BookViewModel, bool>>>();
            if (!string.IsNullOrEmpty(searchString))
            {
                filterList.Add(b =>
                    b.Title.ToLower().Contains(searchString.ToLower()) ||
                    ((!string.IsNullOrEmpty(b.Publisher)) ? (b.Publisher.ToLower().Contains(searchString.ToLower())) : false) ||
                    ((!string.IsNullOrEmpty(b.BookShelfName)) ? (b.BookShelfName.ToLower().Contains(searchString.ToLower())) : false)
                );
            }
            if (!string.IsNullOrEmpty(publishedYearRange))
            {
                int yearStart;
                int.TryParse(publishedYearRange.Split('-')[0], out yearStart);

                int yearEnd;
                int.TryParse(publishedYearRange.Split('-')[1], out yearEnd);

                filterList.Add(b => yearStart <= b.PublishedYear && b.PublishedYear <= yearEnd);
            }
            //if (authorIds != null)
            //{
            //    if (authorIds.Count() > 0)
            //    {
            //        filterList.Add(b => (b.AuthorId != null) ? authorIds.Contains((Guid)b.AuthorId) : false);
            //    }
            //}
            if (categoryIds != null)
            {
                if (categoryIds.Count() > 0)
                {
                    filterList.Add(b => (b.CategoryId != null) ? categoryIds.Contains((Guid)b.CategoryId) : false);
                }
            }

            Func<IQueryable<BookViewModel>, IOrderedQueryable<BookViewModel>>? orderFunc = null;

            // Mặc định là xếp theo ngày tạo
            orderFunc = query => query.OrderByDescending(b => b.CreatedOn);

            if (!string.IsNullOrEmpty(orderBy))
            {
                string orderByString = orderBy.Split('-')[0];
                string ascOrDesc = orderBy.Split("-")[1];

                switch (orderByString)
                {
                    case "Title":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(b => b.Title);
                        else
                            orderFunc = query => query.OrderByDescending(b => b.Title);
                        break;

                    case "Quantity":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(b => b.Quantity);
                        else
                            orderFunc = query => query.OrderByDescending(b => b.Quantity);
                        break;

                    case "AvailableQuantity":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(b => b.AvailableQuantity);
                        else
                            orderFunc = query => query.OrderByDescending(b => b.AvailableQuantity);
                        break;

                    case "TotalPages":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(b => b.TotalPages);
                        else
                            orderFunc = query => query.OrderByDescending(b => b.TotalPages);
                        break;

                    case "PublishedYear":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(b => b.PublishedYear);
                        else
                            orderFunc = query => query.OrderByDescending(b => b.PublishedYear);
                        break;

                    case "CreatedOn":
                        if (ascOrDesc.Equals("Asc"))
                            orderFunc = query => query.OrderBy(b => b.CreatedOn);
                        else
                            orderFunc = query => query.OrderByDescending(b => b.CreatedOn);
                        break;

                    default:
                        break;
                }
            }

            PaginatedResult<BookViewModel> paginatedBooks = await _unitOfWork.BaseRepository<BookViewModel>().GetPaginatedAsync(
                bookViewModels,
                filterList,
                orderFunc,
                "",
                page,
                pageSize
            );

            return Ok(paginatedBooks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(Guid id)
        {
            var booksQuery = _unitOfWork.BookRepository.GetAllInforsQuery();

            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var bookViewModel = await booksQuery.Select(b => new BookViewModel
            {
                Id = b.Id,
                Title = b.Title,
                Publisher = b.Publisher,
                PublishedYear = b.PublishedYear,
                Quantity = b.Quantity,
                AvailableQuantity = b.AvailableQuantity,
                TotalPages = b.TotalPages,
                Price = b.Price,
                ImageUrl = $"{baseUrl}/images/books/{b.ImageUrl}",
                Description = b.Description,
                AuthorName = b.AuthorName,
                CategoryId = b.CategoryId,
                CategoryName = b.Category.Name,
                BookShelfId = b.BookShelfId,
                BookShelfName = b.BookShelf.Name,
                CreatedOn = b.CreatedOn,
            }).FirstOrDefaultAsync(b => b.Id == id);

            if ( bookViewModel == null )
                return NotFound();

            return Ok(bookViewModel);
        }

        [Authorize(Roles = "Admin,Librarian")]
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromForm] BookCreateModel bookDto, [FromForm] IFormFile? image)
        {
            if (bookDto == null)
            {
                return BadRequest("Book data is required.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Xử lý upload ảnh
            string uniqueFileName = "";
            if (image != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/books");
                uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }
            }
            else
            {
                uniqueFileName = "null.png";
            }

            Book bookToCreate = new Book
            {
                Title = bookDto.Title,
                Publisher = bookDto.Publisher,
                PublishedYear = bookDto.PublishedYear,
                Quantity = bookDto.Quantity,
                AvailableQuantity = bookDto.Quantity,
                TotalPages = bookDto.TotalPages,
                Price = bookDto.Price,
                ImageUrl = uniqueFileName,
                Description = bookDto.Description,
                AuthorName = bookDto.AuthorName,
                CategoryId = bookDto.CategoryId,
                BookShelfId = bookDto.BookShelfId,
            };

            _unitOfWork.BookRepository.Add(bookToCreate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                //await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Library", $"Một quyển sách mới vừa được thêm! '{bookToCreate.Title}'");

                return Ok(new { message = "Tạo sách mới thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromForm] BookCreateModel bookDto, [FromForm] IFormFile? image, [FromForm] bool isUpdateImage = false)
        {
            var existingBook = await _unitOfWork.BookRepository.GetByIdAsync(id);
            if (existingBook == null)
            {
                return NotFound(new { message = "Không tìm thấy sách!" });
            }

            existingBook.Title = bookDto.Title;
            existingBook.AuthorName = bookDto.AuthorName;
            existingBook.Publisher = bookDto.Publisher;
            existingBook.PublishedYear = bookDto.PublishedYear;
            existingBook.TotalPages = bookDto.TotalPages;
            existingBook.Price = bookDto.Price;
            existingBook.Description = bookDto.Description;
            existingBook.CategoryId = bookDto.CategoryId;
            existingBook.BookShelfId = bookDto.BookShelfId;

            if (bookDto.Quantity != existingBook.Quantity)
            {
                int diff = bookDto.Quantity - existingBook.Quantity;

                existingBook.Quantity += diff;
                existingBook.AvailableQuantity += diff;

                if (existingBook.AvailableQuantity < 0) 
                {
                    return BadRequest(new { message = "Số lượng sách không hợp lệ!" });
                }
            }

            if (isUpdateImage)
            {
                // Xử lý xóa ảnh cũ nếu có
                if (!existingBook.ImageUrl.Equals("null.png"))
                {
                    string oldImagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images/books", existingBook.ImageUrl);
                    FileInfo file = new FileInfo(oldImagePath);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                }

                // Xử lý upload ảnh
                string uniqueFileName = "";
                if (image != null)
                {
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/books");
                    uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }
                }
                else
                {
                    uniqueFileName = "null.png";
                }
                existingBook.ImageUrl = uniqueFileName;
            }

            _unitOfWork.BookRepository.Update(existingBook);
            var saved = await _unitOfWork.SaveChangesAsync();
            if(saved > 0)
            {
                return Ok(new { message = "Cập nhật sách thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var existingBook = await _unitOfWork.BookRepository.GetByIdAsync(id);
            if (existingBook == null)
            {
                return NotFound(new { message = "Không tìm thấy sách!" });
            }
            _unitOfWork.BookRepository.Delete(existingBook);
            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Đã xóa sách!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBooks([FromBody] List<Guid> IDs)
        {
            foreach (Guid id in IDs)
            {
                var existingBook = await _unitOfWork.BookRepository.GetByIdAsync(id);
                if (existingBook == null)
                {
                    return NotFound(new { message = $"Không tìm thấy sách có ID: {id}" });
                }
                _unitOfWork.BookRepository.Delete(existingBook);
            }
            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Hoàn tất xóa sách!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }
    }
}
