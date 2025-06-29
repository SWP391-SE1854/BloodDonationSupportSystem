using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.BloodRequestRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Eventing.Reader;

namespace BloodDonationSystem.Presentation.Controllers.BloodRequestController
{
    [Route("api/bloodrequest")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BloodRequestController : ControllerBase
    {
        private readonly IBloodRequestRepository _bloodRequestRepository;

        public BloodRequestController(IBloodRequestRepository bloodRequestRepository)
        {
            _bloodRequestRepository = bloodRequestRepository;
        }

        // [GET] Lấy danh sách tất cả yêu cầu (ai cũng xem được)
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var requests = await _bloodRequestRepository.GetAllAsync();
            return Ok(requests);
        }

        // [GET] Xem chi tiết yêu cầu theo ID
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var request = await _bloodRequestRepository.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { Message = "Không tìm thấy yêu cầu." });

            return Ok(request);
        }

        // [POST] Tạo yêu cầu mới (chỉ Admin hoặc Staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPost("new")]
        public async Task<IActionResult> Create([FromBody] BloodRequest request)
        {
            if (request.emergency_status)
                request.request_date = DateTime.Now;
            await _bloodRequestRepository.AddAsync(request);
            return Ok(request);
        }

        // [PUT] Cập nhật yêu cầu (chỉ Admin hoặc Staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BloodRequest updatedRequest)
        {
            var existingRequest = await _bloodRequestRepository.GetByIdAsync(id);
            if (existingRequest == null)
                return NotFound(new { Message = "Không tìm thấy yêu cầu." });

            existingRequest.user_id = updatedRequest.user_id;
            existingRequest.blood_id = updatedRequest.blood_id;
            existingRequest.emergency_status = updatedRequest.emergency_status;
            existingRequest.request_date = DateTime.Now;
            existingRequest.location_id = updatedRequest.location_id;

            await _bloodRequestRepository.UpdateAsync(existingRequest);
            return Ok(existingRequest);
        }

        // [DELETE] Xoá yêu cầu (chỉ Admin hoặc Staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _bloodRequestRepository.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { Message = "Không tìm thấy yêu cầu." });

            await _bloodRequestRepository.DeleteAsync(id);
            return Ok(new { Message = "Xoá yêu cầu thành công." });
        }
    }
}
