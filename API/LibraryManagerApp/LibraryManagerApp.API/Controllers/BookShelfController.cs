using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Writers;
using Microsoft.VisualBasic;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/Bookshelves")]
    [ApiController]
    public class BookShelfController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public BookShelfController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetBookShelves()
        {
            var bookshelves = await _unitOfWork.BookShelfRepository.GetAllBookshelvesWithBookCount();

            return Ok(bookshelves);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookShelf(Guid id)
        {
            var bookshelf = await _unitOfWork.BookShelfRepository.GetBookShelfWithBookCount(id);
            if (bookshelf == null)
            {
                return NotFound(new { message = "Không tìm thấy ngăn sách!" });
            }
            return Ok(bookshelf);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBookshelf(BookShelfCreateModel bookshelfDto)
        {
            var bookshelfToCreate = new BookShelf
            {
                Name = bookshelfDto.Name,
                CabinetId = bookshelfDto.CabinetId,
            };

            _unitOfWork.BookShelfRepository.Add(bookshelfToCreate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Tạo ngăn sách mới thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBookshelf(Guid id, BookShelfCreateModel bookshelfDto)
        {
            var bookshelfToUpdate = await _unitOfWork.BookShelfRepository.GetByIdAsync(id);
            if (bookshelfToUpdate == null)
            {
                return NotFound(new { message = "Không tìm thấy ngăn sách!" });
            }

            bookshelfToUpdate.Name = bookshelfDto.Name;
            bookshelfToUpdate.CabinetId = bookshelfDto.CabinetId;

            _unitOfWork.BookShelfRepository.Update(bookshelfToUpdate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật ngăn sách thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookshelf(Guid id)
        {
            var bookshelfToDelete = await _unitOfWork.BookShelfRepository.GetByIdAsync(id);
            if (bookshelfToDelete == null)
            {
                return NotFound(new { message = "Không tìm thấy ngăn sách!" });
            }

            _unitOfWork.BookShelfRepository.Delete(bookshelfToDelete);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Xóa ngăn sách thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBookshelves([FromBody] List<Guid> ids)
        {
            foreach (Guid id in ids)
            {
                var existingBookshelf = await _unitOfWork.BookShelfRepository.GetByIdAsync(id);
                if (existingBookshelf == null)
                {
                    return NotFound(new { message = $"Không tìm thấy ngăn sách có ID: {id}" });
                }
                _unitOfWork.BookShelfRepository.Delete(existingBookshelf);
            }
            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Hoàn tất xóa ngăn sách!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }
    }
}
