using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.NotificationRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BloodDonationSystem.Presentation.Controllers.NotificationController
{
    [Route("api/notification")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        // ADMIN - xem toàn bộ thông báo
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAll()
        {
            var notifications = await _notificationRepository.GetAllAsync();
            return Ok(notifications);
        }

        // ADMIN - xoá thông báo theo ID
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null)
                return NotFound(new { Message = "Không tìm thấy thông báo." });

            await _notificationRepository.DeleteAsync(id);
            return Ok(new { Message = "Đã xoá thông báo." });
        }

        // STAFF - tạo thông báo
        [Authorize(Policy = "StaffOnly")]
        [HttpPost("staff")]
        public async Task<IActionResult> Create([FromBody] Notification notification)
        {
            notification.sent_date = DateTime.UtcNow;
            notification.read_status = false;

            var created = await _notificationRepository.AddAsync(notification);
            return Ok(created);
        }

        // MEMBER - xem tất cả thông báo của mình
        [HttpGet("member")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "Token không hợp lệ." });

            var all = await _notificationRepository.GetAllAsync();
            var mine = all.Where(n => n.user_id == userId).ToList();
            return Ok(mine);
        }

        // MEMBER - đánh dấu đã đọc
        [HttpPut("member/{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { Message = "Token không hợp lệ." });

            var noti = await _notificationRepository.GetByIdAsync(id);
            if (noti == null || noti.user_id != userId)
                return NotFound(new { Message = "Thông báo không tồn tại hoặc không thuộc về bạn." });

            noti.read_status = true;
            await _notificationRepository.UpdateAsync(noti);
            return Ok(noti);
        }

        // Helper method để lấy user_id từ token
        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;

            return userId;
        }
    }
}
