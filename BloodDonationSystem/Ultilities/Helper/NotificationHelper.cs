namespace BloodDonationSystem.Utilities.Helper
{
    public static class NotificationHelper
    {
        public static string FormatNotification(string message)
        {
            return $"[Blood Donation Notification] - {message}";
        }

        public static string GenerateReminderMessage(string userName, DateTime date)
        {
            return $"Hi {userName}, please remember your donation appointment on {date:MMMM dd, yyyy}.";
        }
    }
}