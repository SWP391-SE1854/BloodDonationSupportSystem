using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.DonationHistoryRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BloodDonationSystem.Presentation.Controllers.DonationHistoryController
{
    [Route("api/donation-history")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class DonationHistoryController : ControllerBase
    {
        private readonly IDonationHistoryRepository _donationHistoryRepo;

        public DonationHistoryController(IDonationHistoryRepository donationHistoryRepo)
        {
            _donationHistoryRepo = donationHistoryRepo;
        }

        // -------------------- ADMIN --------------------

        // Lấy toàn bộ lịch sử hiến máu
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAll()
        {
            var histories = await _donationHistoryRepo.GetAllAsync();
            return Ok(histories);
        }

        // Lấy một bản ghi cụ thể theo ID
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("admin/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var history = await _donationHistoryRepo.GetByIdAsync(id);
            if (history == null)
                return NotFound(new { Message = "Không tìm thấy bản ghi." });

            return Ok(history);
        }

        // Xóa một bản ghi
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _donationHistoryRepo.DeleteAsync(id);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy để xoá." });

            return NoContent();
        }

        // -------------------- STAFF --------------------

        // Staff xem lịch sử của 1 người dùng bất kỳ
        [Authorize(Policy = "StaffOnly")]
        [HttpGet("staff/user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var histories = await _donationHistoryRepo.GetByUserIdAsync(userId);
            return Ok(histories);
        }

        // -------------------- MEMBER --------------------

        // Member chỉ xem được lịch sử của chính mình
        [Authorize(Policy = "MemberOnly")]
        [HttpGet("member")]
        public async Task<IActionResult> GetMyHistory()
        {
            // Lấy user_id từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            var histories = await _donationHistoryRepo.GetByUserIdAsync(userId);
            return Ok(histories);
        }
    }
}
