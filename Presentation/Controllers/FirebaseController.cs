using BloodDonationSystem.BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodDonationSystem.Presentation.Controllers
{
    [Route("api/firebase")]
    [ApiController]
    public class FirebaseController : ControllerBase
    {
        private readonly FirebaseAdminService _firebaseService;
        private readonly EmailService _emailService;

        public FirebaseController(FirebaseAdminService firebaseService, EmailService emailService)
        {
            _firebaseService = firebaseService;
            _emailService = emailService;
        }

        [HttpPost("send-reset-password")]
        public async Task<IActionResult> SendResetPassword([FromBody] string email)
        {
            var resetLink = await _firebaseService.GeneratePasswordResetLinkAsync(email);
            await _emailService.SendResetPasswordEmail(email, resetLink);
            return Ok(new { message = "Đã gửi email khôi phục mật khẩu" });
        }
    }

}