using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.DonationRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BloodDonationSystem.Presentation.Controllers.DonationController
{
    [Route("api/donation")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class DonationController : ControllerBase
    {
        private readonly IDonationRepository _donationRepository;

        public DonationController(IDonationRepository donationRepository)
        {
            _donationRepository = donationRepository;
        }

        // Lấy toàn bộ yêu cầu hiến máu (chỉ admin và staff được phép)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllDonations()
        {
            var donations = await _donationRepository.GetAllAsync();
            return Ok(donations);
        }
        // Lấy tất cả yêu cầu hiến máu theo user ID cụ thể (admin hoặc staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("users")]
        public async Task<IActionResult> GetDonationsByUserId(int userId)
        {
            var donation = await _donationRepository.GetByIdAsync(userId);
            if (donation == null)
                return NotFound(new { Message = "Không tìm thấy yêu cầu của người dùng này." });

            return Ok(donation);
        }
        

      

        // MEMBER: Tạo yêu cầu mới (chỉ tạo cho chính mình)
        [Authorize(Policy = "MemberOnly")]
        [HttpPost("member")]
        public async Task<IActionResult> CreateDonation([FromBody] Donation newDonation)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            newDonation.user_id = userId;
            await _donationRepository.AddAsync(newDonation);
            return Ok(newDonation);
        }

       
    }
}