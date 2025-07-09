using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace BloodDonationSystem.DataAccess.Entities
{
    public class Report
    {
        [Key]
        public int ReportId { get; set; }

        public string? Title { get; set; }

        public DateTime Date { get; set; }

        public string? Content { get; set; }

        // Foreign Key
        public int UserId { get; set; }

        // Navigation property
        public User? User { get; set; }
    }
}
