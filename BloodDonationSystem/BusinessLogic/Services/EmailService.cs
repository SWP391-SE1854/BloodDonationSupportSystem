using MailKit.Net.Smtp;
using MimeKit;

namespace BloodDonationSystem.BusinessLogic.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendResetPasswordEmail(string toEmail, string resetLink)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Blood Donation System", _config["EmailSettings:From"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Reset your password";

            message.Body = new TextPart("html")
            {
                Text = $"<p>Click the link below to reset your password:</p><p><a href='{resetLink}'>{resetLink}</a></p>"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_config["EmailSettings:From"], _config["EmailSettings:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}