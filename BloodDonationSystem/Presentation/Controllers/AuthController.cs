using Microsoft.AspNetCore.Mvc;
using BloodDonationSystem.DataAccess.Entities;
using FirebaseAdmin.Auth;
using BloodDonationSystem.DataAccess.Repositories.UserRepo;
using Microsoft.AspNetCore.Authorization;
using BloodDonationSystem.BusinessLogic.Services;

namespace BloodDonationSystem.Presentation.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _configuration;
    private readonly IUserRepository _userRepo;
    private readonly FirebaseAdminService _firebaseService;
    private readonly EmailService _emailService;

    public AuthController(
        AuthService authService,
        JwtService jwtService,
        IConfiguration configuration,
        IUserRepository userRepo,
        FirebaseAdminService firebaseService,
        EmailService emailService
    )
    {
        _authService = authService;
        _jwtService = jwtService;
        _configuration = configuration;
        _userRepo = userRepo;
        _firebaseService = firebaseService;
        _emailService = emailService;
    }

    // Đăng ký tài khoản  
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new User
        {
            name = request.Name,
            email = request.Email,
            phone = request.Phone,
            dob = request.Dob,
            city = request.City,
            district = request.District,
            address = request.Address,
            role = "Member" // Mặc định role là "Người dùng"  
        };

        var isSuccess = await _authService.RegisterAsync(user, request.Password);
        if (!isSuccess)
            return Conflict("Email đã tồn tại!");

        try
        {
            var args = new UserRecordArgs()
            {
                Email = request.Email,
                EmailVerified = false,
                Password = request.Password,
                DisplayName = request.Name,
                Disabled = false,
            };
            var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);
        }
        catch (Exception ex)
        {
            // Optional: rollback nếu cần
            //await _userRepo.DeleteUserAsync(user);
            return StatusCode(500, new { message = "Tạo user trên Firebase thất bại", error = ex.Message });
        }

        return Ok("Đăng ký thành công!");
    }

    
    [HttpPost("firebase-login")]
    public async Task<IActionResult> FirebaseLogin()
    {
        try
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (!authHeader.StartsWith("Bearer ")) return Unauthorized();

            var idToken = authHeader.Substring("Bearer ".Length);
            FirebaseToken decodedToken;
            try
            {
                decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            }
            catch
            {
                return Unauthorized("Firebase Token không hợp lệ");
            }

            var email = decodedToken.Claims["email"]?.ToString();
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email không được tìm thấy trong Firebase Token");
            }
            var name = decodedToken.Claims.ContainsKey("name")
                        ? decodedToken.Claims["name"]?.ToString()
    :                   email!.Split('@')[0]; // fallback

            if (string.IsNullOrEmpty(name))
                name = email!.Split('@')[0]; // fallback lần nữa


            var user = await _userRepo.GetUserByEmailAsync(email);
            if (user == null)
            {
                user = new User
                {
                    email = email,
                    name = name,
                    phone = "",
                    role = "Member"
                };
                await _userRepo.AddUserAsync(user);
            }

            var jwt = _jwtService.GenerateToken(user);
            return Ok(new { token = jwt });
        }
        catch (KeyNotFoundException)
        {
            return BadRequest(new { error = "Key not found in request" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi xác thực Firebase", error = ex.Message });
        }
    }

        [HttpPost("send-reset-password")]
        public async Task<IActionResult> SendResetPassword([FromBody] string email)
        {
            var resetLink = await _firebaseService.GeneratePasswordResetLinkAsync(email);
            await _emailService.SendResetPasswordEmail(email, resetLink);
            return Ok(new { message = "Đã gửi email khôi phục mật khẩu" });
        }
    

}

// DTO cho các request  
public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password, string Phone, DateTime Dob, String City, String District, String Address);
