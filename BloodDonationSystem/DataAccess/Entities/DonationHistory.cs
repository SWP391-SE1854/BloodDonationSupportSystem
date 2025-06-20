using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class DonationHistory
    {
        [Key]
        public int donation_id { get; set; }
        public int user_id { get; set; }
        public int unit_id { get; set; }
        public DateTime donation_date { get; set; }
        public string status { get; set; } = string.Empty;
        public string? blood_type { get; set; }
        public string location { get; set; } = string.Empty;
        public int quantity { get; set; }

        // Navigation
        [ForeignKey("user_id")]
        public User? User { get; set; }

        [ForeignKey("unit_id")]
        public BloodInventory? BloodInventory { get; set; }






    }
}
