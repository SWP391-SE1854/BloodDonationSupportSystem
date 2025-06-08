using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories;
using BloodDonationSystem.DataAccess.Repositories.BloodPostRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BloodDonationSystem.Presentation.Controllers.BloodPostController
{
    [Route("api/bloodpost")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BloodPostController : ControllerBase
    {
        private readonly IBloodPostRepository _bloodPostRepository;

        public BloodPostController(IBloodPostRepository bloodPostRepository)
        {
            _bloodPostRepository = bloodPostRepository;
        }

        // [GET] Lấy tất cả bài đăng (ai cũng xem được)
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _bloodPostRepository.GetAllAsync();
            return Ok(posts);
        }

        // [GET] Lấy chi tiết bài đăng theo ID
        [AllowAnonymous]
        [HttpGet("select_post")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _bloodPostRepository.GetByIdAsync(id);
            if (post == null)
                return NotFound(new { Message = "Không tìm thấy bài đăng." });

            return Ok(post);
        }

        // [POST] Tạo mới bài đăng (chỉ Admin hoặc Staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPost("newpost")]
        public async Task<IActionResult> Create([FromBody] BloodPost post)
        {
            post.Date = DateTime.Now;
            await _bloodPostRepository.AddAsync(post);
            return Ok(post);
        }

        // [PUT] Cập nhật bài đăng (chỉ Admin hoặc Staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPut("update-post")]
        public async Task<IActionResult> Update(int id, [FromBody] BloodPost updatedPost)
        {
            var existingPost = await _bloodPostRepository.GetByIdAsync(id);
            if (existingPost == null)
                return NotFound(new { Message = "Không tìm thấy bài đăng." });

            existingPost.UserId = updatedPost.UserId;
            existingPost.Date = DateTime.Now;

            await _bloodPostRepository.UpdateAsync(existingPost);
            return Ok(existingPost);
        }

        // [DELETE] Xoá bài đăng (chỉ Admin hoặc Staff)
        [Authorize(Policy = "AdminOrStaff")]
        [HttpDelete("delete-post")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _bloodPostRepository.GetByIdAsync(id);
            if (post == null)
                return NotFound(new { Message = "Không tìm thấy bài đăng." });

            await _bloodPostRepository.DeleteAsync(id);
            return Ok(new { Message = "Xoá bài đăng thành công." });
        }
    }
}
