using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/Categories")]
    [ApiController]
    public class CategoryController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(Guid id)
        {
            var category = await _unitOfWork.CategoryRepository.GetCategoryWithBookCount(id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục!" });
            }

            return Ok(category);
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            IList<CategoryViewModal> categories = await _unitOfWork.CategoryRepository.GetAllCategoriesWithBookCount();

            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategories([FromBody] CategoryCreateModal categoryDto)
        {
            Category categoryToCreate = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
            };

            _unitOfWork.CategoryRepository.Add(categoryToCreate);
            int saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Tạo danh mục mới thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryCreateModal categoryUpdate)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            if (category == null) 
            {
                return NotFound(new { message = "Không tìm thấy danh mục!" });
            }

            category.Name = categoryUpdate.Name;
            category.Description = categoryUpdate.Description;

            int saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật danh mục thành công!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var existCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            if (existCategory == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục!" });
            }

            _unitOfWork.CategoryRepository.Delete(existCategory);
            int saved = await _unitOfWork.SaveChangesAsync();

            if (saved > 0)
            {
                return Ok(new { message = "Xóa danh mục thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCategories([FromBody] List<Guid> ids)
        {
            foreach (Guid id in ids)
            {
                var existingCategory = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
                if (existingCategory == null)
                {
                    return NotFound(new { message = $"Không tìm thấy danh mục có ID: {id}" });
                }
                _unitOfWork.CategoryRepository.Delete(existingCategory);
            }
            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Hoàn tất xóa danh mục!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }
    }
}
