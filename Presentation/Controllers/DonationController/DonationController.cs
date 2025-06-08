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

        // ADMIN & STAFF: GET ALL DONATIONS
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllDonations()
        {
            var donations = await _donationRepository.GetAllAsync();
            return Ok(donations);
        }

        // MEMBER, STAFF, ADMIN: Lấy yêu cầu của người dùng hiện tại (member chỉ xem của mình)
        [Authorize(Policy = "MemberOnly,StaffOnly,AdminOnly")]
        [HttpGet("user")]
        public async Task<IActionResult> GetDonationsForCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            var donations = await _donationRepository.GetByIdAsync(userId);
            return Ok(donations);
        }

        // STAFF & ADMIN: GET DONATIONS BY ANY USER ID
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetDonationsByUserId(int userId)
        {
            var donations = await _donationRepository.GetByIdAsync(userId);
            return Ok(donations);
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