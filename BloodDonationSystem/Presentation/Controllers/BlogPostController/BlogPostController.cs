using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.BlogPostRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BloodDonationSystem.Presentation.Controllers.BlogController
{
    [Route("api/blog")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BlogPostController : ControllerBase
    {
        private readonly IBlogPostRepository _blogPostRepository;

        public BlogPostController(IBlogPostRepository blogPostRepository)
        {
            _blogPostRepository = blogPostRepository;
        }

        // Ai cũng xem được danh sách bài viết
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _blogPostRepository.GetAllAsync();
            return Ok(blogs);
        }

        //Xem chi tiết 1 bài viết
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _blogPostRepository.GetByIdAsync(id);
            if (blog == null)
                return NotFound(new { Message = "Không tìm thấy bài viết." });

            return Ok(blog);
        }

        // Chỉ ADMIN hoặc STAFF được thêm bài viết
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BlogPost blogPost)
        {
            blogPost.date = DateTime.Now; // Cập nhật thời gian tạo
            await _blogPostRepository.AddAsync(blogPost);
            return Ok(blogPost);
        }

        // Chỉ ADMIN hoặc STAFF được cập nhật bài viết
        [Authorize(Policy = "AdminOrStaff")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BlogPost updatedPost)
        {
            var existingPost = await _blogPostRepository.GetByIdAsync(id);
            if (existingPost == null)
                return NotFound(new { Message = "Không tìm thấy bài viết." });

            existingPost.title = updatedPost.title;
            existingPost.content = updatedPost.content;
            existingPost.date = DateTime.Now;
            existingPost.url = updatedPost.url; 
            existingPost.image = updatedPost.image;

            await _blogPostRepository.UpdateAsync(existingPost);
            return Ok(existingPost);
        }

        // Chỉ ADMIN hoặc STAFF được xóa bài viết
        [Authorize(Policy = "AdminOrStaff")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _blogPostRepository.GetByIdAsync(id);
            if (blog == null)
                return NotFound(new { Message = "Không tìm thấy bài viết." });

            await _blogPostRepository.DeleteAsync(id);
            return Ok(new { Message = "Xoá bài viết thành công." });
        }
    }
}
