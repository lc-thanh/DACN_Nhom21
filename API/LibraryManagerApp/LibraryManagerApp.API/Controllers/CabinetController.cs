using LibraryManagerApp.Data.Dto;
using LibraryManagerApp.Data.Interfaces;
using LibraryManagerApp.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace LibraryManagerApp.API.Controllers
{
    [Route("api/v1/[controller]s")]
    [ApiController]
    public class CabinetController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public CabinetController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetCabinets()
        {
            var cabinets = await _unitOfWork.CabinetRepository.GetAllCabinetsWithAllInfors();
            return Ok(cabinets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCabinetById(Guid id)
        {
            var cabinet = await _unitOfWork.CabinetRepository.GetCabinetWithAllInfors(id);
            if (cabinet == null)
            {
                return NotFound(new { message = "Không tìm thấy tủ sách!" });
            }
            return Ok(cabinet);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCabinet(CabinetCreateModel cabinetDto)
        {
            var cabinetToCreate = new Cabinet
            {
                Name = cabinetDto.Name,
                Location = cabinetDto.Location,
            };

            _unitOfWork.CabinetRepository.Add(cabinetToCreate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Tạo tủ mới thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCabinet(Guid id, CabinetCreateModel cabinetDto)
        {
            var cabinetToUpdate = await _unitOfWork.CabinetRepository.GetByIdAsync(id);
            if (cabinetToUpdate == null)
            {
                return NotFound(new { message = "Không tìm thấy tủ sách!" });
            }

            cabinetToUpdate.Name = cabinetDto.Name;
            cabinetToUpdate.Location = cabinetDto.Location;

            _unitOfWork.CabinetRepository.Update(cabinetToUpdate);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Cập nhật tủ thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCabinet(Guid id)
        {
            var cabinetToDelete = await _unitOfWork.CabinetRepository.GetByIdAsync(id);
            if (cabinetToDelete == null)
            {
                return NotFound(new { message = "Không tìm thấy tủ sách!" });
            }

            _unitOfWork.CabinetRepository.Delete(cabinetToDelete);

            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Xóa tủ sách thành công!" });
            }

            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCabinets([FromBody] List<Guid> ids)
        {
            foreach (Guid id in ids)
            {
                var existingCabinet = await _unitOfWork.CabinetRepository.GetByIdAsync(id);
                if (existingCabinet == null)
                {
                    return NotFound(new { message = $"Không tìm thấy tủ sách có ID: {id}" });
                }
                _unitOfWork.CabinetRepository.Delete(existingCabinet);
            }
            var saved = await _unitOfWork.SaveChangesAsync();
            if (saved > 0)
            {
                return Ok(new { message = "Hoàn tất xóa tủ sách!" });
            }
            return StatusCode(500, new { message = "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
        }
    }
}
