using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.LocationRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BloodDonationSystem.Presentation.Controllers.LocationController
{
    [Route("api/location")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class LocationController : ControllerBase
    {
        private readonly ILocationRepository _locationRepository;
        private readonly IUserRepository _userRepository;

        public LocationController(ILocationRepository locationRepository, IUserRepository userRepository)
        {
            _locationRepository = locationRepository;
            _userRepository = userRepository;
        }

        // -------------------- STAFF / ADMIN --------------------

        // Xem tất cả địa điểm (chỉ staff & admin)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllLocations()
        {
            var locations = await _locationRepository.GetAllAsync();
            return Ok(locations);
        }

        // -------------------- MEMBER --------------------

        // Member cập nhật địa điểm của chính mình
        [Authorize(Policy = "MemberOnly")]
        [HttpPut("member/update")]
        public async Task<IActionResult> UpdateMyLocation([FromBody] Location updatedLocation)
        {
            // Lấy user_id từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            // Lấy user từ DB
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "Không tìm thấy người dùng." });

            // Cập nhật thông tin địa điểm (gán về cho user)
            user.city = updatedLocation.name ?? user.city;
            user.address = updatedLocation.address ?? user.address;
            user.district = updatedLocation.district ?? user.district;

            var result = await _userRepository.UpdateUserAsync(user);
            return Ok(user);
        }
    }
}
