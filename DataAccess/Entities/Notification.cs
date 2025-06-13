using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class Notification
    {
        [Key]
        public int notification_id { get; set; }
        public int user_id { get; set; }
        public string title { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public bool read_status { get; set; }
        public DateTime sent_date { get; set; }

        // Navigation
        public User? User { get; set; }
    }
}
