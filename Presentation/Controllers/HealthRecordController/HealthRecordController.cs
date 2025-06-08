using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.HealthRecordRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BloodDonationSystem.Presentation.Controllers.HealthRecordController
{
    [Route("api/healthrecord")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class HealthRecordController : ControllerBase
    {
        private readonly IHealthRecordRepository _healthRecordRepository;

        public HealthRecordController(IHealthRecordRepository healthRecordRepository)
        {
            _healthRecordRepository = healthRecordRepository;
        }

        // ADMIN & STAFF: GET ALL
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllHealthRecords()
        {
            var records = await _healthRecordRepository.GetAllAsync();
            return Ok(records);
        }

        // MEMBER, STAFF, ADMIN: GET BY USER ID (member chỉ xem của mình)
        [Authorize(Policy = "MemberOnly,StaffOnly,AdminOnly")]
        [HttpGet("view")]
        public async Task<IActionResult> GetHealthRecordForCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            var record = await _healthRecordRepository.GetByUserIdAsync(userId);
            if (record == null)
                return NotFound(new { Message = "Không tìm thấy health record" });

            return Ok(record);
        }

        // STAFF & ADMIN: GET BY ANY USER ID
        [Authorize(Policy = "AdminOrStaff")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetHealthRecordByUserId(int userId)
        {
            var record = await _healthRecordRepository.GetByUserIdAsync(userId);
            if (record == null)
                return NotFound(new { Message = "Không tìm thấy health record" });

            return Ok(record);
        }

        // MEMBER: CREATE (chỉ tạo cho chính mình)
        [Authorize(Policy = "MemberOnly")]
        [HttpPost("member")]
        public async Task<IActionResult> CreateHealthRecord([FromBody] HealthRecord newRecord)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            newRecord.user_id = userId;
            await _healthRecordRepository.AddAsync(newRecord);
            return Ok(newRecord);
        }

        // MEMBER: UPDATE (chỉ update của mình)
        [Authorize(Policy = "MemberOnly")]
        [HttpPut("member")]
        public async Task<IActionResult> UpdateHealthRecordForCurrentUser([FromBody] HealthRecord updatedRecord)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            var existingRecord = await _healthRecordRepository.GetByUserIdAsync(userId);
            if (existingRecord == null)
                return NotFound(new { Message = "Không tìm thấy health record" });

            // Update fields
            existingRecord.weight = updatedRecord.weight;
            existingRecord.height = updatedRecord.height;
            existingRecord.blood_type = updatedRecord.blood_type;
            existingRecord.allergies = updatedRecord.allergies;
            existingRecord.medication = updatedRecord.medication;
            existingRecord.last_donation = updatedRecord.last_donation;
            existingRecord.eligibility_status = updatedRecord.eligibility_status ?? existingRecord.eligibility_status;
            existingRecord.donation_count = updatedRecord.donation_count;

            await _healthRecordRepository.UpdateAsync(existingRecord);
            return Ok(existingRecord);
        }

        // STAFF & ADMIN: UPDATE BY RECORD ID
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthRecord(int id, [FromBody] HealthRecord updatedRecord)
        {
            var existingRecord = await _healthRecordRepository.GetByIdAsync(id);
            if (existingRecord == null)
                return NotFound(new { Message = "Không tìm thấy health record" });

            // Update fields
            existingRecord.weight = updatedRecord.weight;
            existingRecord.height = updatedRecord.height;
            existingRecord.blood_type = updatedRecord.blood_type;
            existingRecord.allergies = updatedRecord.allergies;
            existingRecord.medication = updatedRecord.medication;
            existingRecord.last_donation = updatedRecord.last_donation;
            existingRecord.eligibility_status = updatedRecord.eligibility_status ?? existingRecord.eligibility_status;
            existingRecord.donation_count = updatedRecord.donation_count;

            await _healthRecordRepository.UpdateAsync(existingRecord);
            return Ok(existingRecord);
        }


    }
}
