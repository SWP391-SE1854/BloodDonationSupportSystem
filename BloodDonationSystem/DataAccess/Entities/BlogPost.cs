using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public string? url { get; set; } = string.Empty;
        public string? image { get; set; } = string.Empty;

        // Navigation
        [ForeignKey("user_id")]
        public User? User { get; set; }
    }
}
