using System.ComponentModel.DataAnnotations;

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
        public string component { get; set; } = string.Empty;
        public string location { get; set; } = string.Empty;
        public int quantity { get; set; }

        // Navigation
        public User? User { get; set; }
        public BloodInventory? BloodInventory { get; set; }







    }
}
