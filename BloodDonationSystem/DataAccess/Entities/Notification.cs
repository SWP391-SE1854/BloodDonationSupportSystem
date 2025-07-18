using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int notification_id { get; set; }
        public int user_id { get; set; }
        public string title { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public bool read_status { get; set; }
        public DateTime sent_date { get; set; }

        // Navigation
        [ForeignKey("user_id")]
        public User? User { get; set; }
    }
}
