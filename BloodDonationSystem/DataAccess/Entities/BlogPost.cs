using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class BlogPost
    {
        [Key]
        public int blog_id { get; set; }
        public int user_id { get; set; }
        public DateTime date { get; set; }
        public string title { get; set; } = string.Empty;
        public string content { get; set; } = string.Empty;

        // Navigation
        public User? User { get; set; }
    }
}
