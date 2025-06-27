using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.UserRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BloodDonationSystem.Presentation.Controllers.UserController
{
    [Route("api/user")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : ControllerBase
    {


        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }



        // ADMIN  
        [Authorize(Policy = "AdminOnly")]
        // GET: api/admin/all
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/admin/users/5
        [HttpGet("admin/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "Không tìm thấy user" });

            return Ok(user);
        }

        // PUT: api/admin/5
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
                return NotFound(new { Message = "Không tìm thấy user" });

            existingUser.name = updatedUser.name;
            existingUser.email = updatedUser.email;
            existingUser.phone = updatedUser.phone;
            existingUser.role = updatedUser.role;

            await _userRepository.UpdateUserAsync(existingUser);
            return Ok(existingUser);
        }


        // STAFF


        [Authorize(Policy = "StaffOnly")]
        // GET: api/staffs/staff/2
        [HttpGet("staff")]
        public async Task<IActionResult> GetStaffById()
        {
            // Lấy user_id từ token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "User ID trong token không hợp lệ." });

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "Không tìm thấy thông tin người dùng." });


            userId = int.Parse(userIdClaim.Value);

            // Truy vấn DB
            user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound("User không tồn tại.");

            // Trả về thông tin user
            return Ok(new
            {
                user.user_id,
                user.name,
                user.email,
                user.phone,
                user.dob,
                user.role,
                user.city,
                user.district,
                user.address
            });
        }

        // PUT: api/staffs/staff/2
        [HttpPut("staff")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] User updatedUser)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
                return NotFound(new { Message = "Không tìm thấy user" });

            existingUser.name = updatedUser.name ?? existingUser.name;
            existingUser.email = updatedUser.email ?? existingUser.email;
            existingUser.phone = updatedUser.phone ?? existingUser.phone;
            existingUser.dob = updatedUser.dob ?? existingUser.dob;
            existingUser.address = updatedUser.address ?? existingUser.address;
            existingUser.city = updatedUser.city ?? existingUser.city;
            existingUser.district = updatedUser.district ?? existingUser.district;
            

            await _userRepository.UpdateUserAsync(existingUser);
            return Ok(existingUser);
        }

        // GET: api/staffs/staff/user
        [HttpGet("staff/all")]
        public async Task<IActionResult> GetAllMembers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);

        }

        // GET: api/user/compatible-donors?recipientBloodType=A+
        [Authorize(Policy = "StaffOnly")]
        [HttpGet("compatible-donors")]
        public async Task<IActionResult> GetCompatibleDonors([FromQuery] string recipientBloodType)
        {
            if (string.IsNullOrWhiteSpace(recipientBloodType))
                return BadRequest(new { Message = "Recipient blood type is required." });

            var users = await _userRepository.GetUsersByBloodCompatibilityAsync(recipientBloodType);
            return Ok(users);
        }


        // GET: api/members/member
        [HttpGet("member")]
        public async Task<IActionResult> GetMemberById()
        {
            // Lấy user_id từ token

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "User ID trong token không hợp lệ." });

            // Truy vấn DB
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "Không tìm thấy thông tin người dùng." });

            // Trả về thông tin user
            return Ok(new
            {
                user.user_id,
                user.name,
                user.email,
                user.phone,
                user.dob,
                user.role,
                user.city,
                user.district,
                user.address
            });
        }

        // PUT: api/members/member/modify_profile
        [HttpPut("member/modify_profile")]
        public async Task<IActionResult> UpdateMember([FromBody] User updatedUser)
        {
            // Lấy user_id từ token

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { Message = "Token không hợp lệ hoặc thiếu thông tin." });

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Message = "User ID trong token không hợp lệ." });

            // Truy vấn DB
            var existingUser = await _userRepository.GetUserByIdAsync(userId);
            if (existingUser == null)
                return NotFound(new { Message = "Không tìm thấy thông tin người dùng." });

            existingUser.name = updatedUser.name ?? existingUser.name;
            existingUser.email = updatedUser.email ?? existingUser.email;
            existingUser.phone = updatedUser.phone ?? existingUser.phone;
            existingUser.dob = updatedUser.dob ?? existingUser.dob;
            existingUser.address = updatedUser.address ?? existingUser.address;
            existingUser.city = updatedUser.city ?? existingUser.city;
            existingUser.district = updatedUser.district ?? existingUser.district;
           
                

            await _userRepository.UpdateUserAsync(existingUser);
            return Ok(existingUser);
        }
    }
}
