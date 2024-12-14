using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.AspNetCore.Mvc;

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
    }
}
