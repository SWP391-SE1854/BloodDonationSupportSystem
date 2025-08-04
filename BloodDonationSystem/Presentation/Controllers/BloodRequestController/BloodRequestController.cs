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
            {
                request.request_date = DateTime.Now;
                request.end_date = DateTime.Now.AddDays(2);
            }
            else
            {
                
                if (request.request_date == default || request.end_date == default)
                {
                    return BadRequest(new { Message = "Phải nhập ngày bắt đầu và kết thúc." });
                }

                if (request.end_date <= request.request_date)
                {
                    return BadRequest(new { Message = "Ngày kết thúc phải sau ngày bắt đầu." });
                }

                if (request.donor_count <= 0)
                {
                    return BadRequest(new { Message = "Vui lòng nhập số lượng người đi hiến máu hợp lệ (> 0)." });
                }
               
                if (string.IsNullOrWhiteSpace(request.location_donate))
                {
                    return BadRequest(new { Message = "Vui lòng chọn địa điểm đi hiến máu." });
                }
            }

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
          
            if (updatedRequest.emergency_status)
            {
                existingRequest.request_date = DateTime.Now;
                existingRequest.end_date = DateTime.Now.AddDays(2);
            }
            else
            {
                if (updatedRequest.end_date <= updatedRequest.request_date)
                {
                    return BadRequest(new { Message = "Ngày kết thúc phải sau ngày bắt đầu." });
                }
                
                if (updatedRequest.donor_count <= 0)
                {
                    return BadRequest(new { Message = "Vui lòng nhập số lượng người hiến máu hợp lệ (> 0)." });
                }

                if (string.IsNullOrWhiteSpace(updatedRequest.location_donate))
                {
                    return BadRequest(new { Message = "Vui lòng chọn địa điểm đi hiến máu." });
                }

                existingRequest.request_date = updatedRequest.request_date;
                existingRequest.end_date = updatedRequest.end_date;
                existingRequest.donor_count = updatedRequest.donor_count;
                existingRequest.location_donate = updatedRequest.location_donate;
            }
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


        // [GET] Lấy danh sách yêu cầu hiến máu của thành viên hiện tại
        [Authorize(Roles = "Member")]
        [HttpGet("member-requests")]
        public async Task<IActionResult> GetMemberRequests()
        {
            // Lấy userId từ claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id");
            if (userIdClaim == null)
                return Unauthorized(new { Message = "Không xác định được người dùng." });

            int userId = int.Parse(userIdClaim.Value);
            var allRequests = await _bloodRequestRepository.GetAllAsync();
            var myRequests = allRequests.Where(r => r.user_id == userId).ToList();
            return Ok(myRequests);
        }




    }
}
