using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/notification")]
public class NotificationController : ControllerBase
{
    private readonly FirebaseNotificationService _firebaseService;

    public NotificationController(FirebaseNotificationService firebaseService)
    {
        _firebaseService = firebaseService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Body))
        {
            return BadRequest(new { error = "Token, Title, and Body are required fields." });
        }

        var result = await _firebaseService.SendNotificationAsync(request.Token, request.Title, request.Body);
        return Ok(new { messageId = result });
    }
}

public class NotificationRequest
{
    public string? Token { get; set; }
    public string? Title { get; set; }
    public string? Body { get; set; }
}
