using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;

public class FirebaseNotificationService
{

    public FirebaseNotificationService(IWebHostEnvironment env)
    {
    }

    public async Task<string> SendNotificationAsync(string token, string title, string body)
    {
        var message = new Message()
        {
            Token = token,
            Notification = new Notification()
            {
                Title = title,
                Body = body
            }
        };

        var response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        return response;
    }
}
