using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.BloodInventoryRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BloodDonationSystem.Presentation.Controllers.BloodController
{
    [Route("api/blood-inventory")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Policy = "AdminOrStaff")] // Chỉ Admin và Staff truy cập được tất cả các action
    public class BloodInventoryController : ControllerBase
    {
        private readonly IBloodInventoryRepository _inventoryRepository;

        public BloodInventoryController(IBloodInventoryRepository inventoryRepository)
        {
            _inventoryRepository = inventoryRepository;
        }

        //Lấy danh sách tất cả đơn vị máu
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _inventoryRepository.GetAllAsync();
            return Ok(list);
        }

        //Lấy thông tin chi tiết của 1 đơn vị máu theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var unit = await _inventoryRepository.GetByIdAsync(id);
            if (unit == null)
                return NotFound(new { Message = "Không tìm thấy đơn vị máu." });

            return Ok(unit);
        }

        //Tạo mới đơn vị máu
        [HttpPost("add-blood")]
        public async Task<IActionResult> Create([FromBody] BloodInventory newUnit)
        {
            await _inventoryRepository.AddAsync(newUnit);
            return Ok(newUnit);
        }

        //Cập nhật thông tin đơn vị máu
        [HttpPut("update-blood")]
        public async Task<IActionResult> Update(int id, [FromBody] BloodInventory updatedUnit)
        {
            var existingUnit = await _inventoryRepository.GetByIdAsync(id);
            if (existingUnit == null)
                return NotFound(new { Message = "Không tìm thấy đơn vị máu." });

            existingUnit.status = updatedUnit.status;
            existingUnit.quantity = updatedUnit.quantity;
            existingUnit.expiration_date = updatedUnit.expiration_date;
            existingUnit.blood_type = updatedUnit.blood_type;
            existingUnit.donation_id = updatedUnit.donation_id;

            await _inventoryRepository.UpdateAsync(existingUnit);
            return Ok(existingUnit);
        }

        //Xóa đơn vị máu
        [HttpDelete("delete-blood")]
        public async Task<IActionResult> Delete(int id)
        {
            var unit = await _inventoryRepository.GetByIdAsync(id);
            if (unit == null)
                return NotFound(new { Message = "Không tìm thấy đơn vị máu." });

            await _inventoryRepository.DeleteAsync(id);
            return Ok(new { Message = "Xóa đơn vị máu thành công." });
        }
    }
}
