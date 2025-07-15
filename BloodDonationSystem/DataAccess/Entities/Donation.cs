using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class Donation
    {
        [Key]
        public int donation_id { get; set; } // Primary key
       public int unit_id { get; set; } // Foreign key to BloodInventory
        public int user_id { get; set; } 
        public DateTime donation_date { get; set; } // Ngày hiến máu
        public string? blood_type { get; set; } // Nhóm máu
        public int quantity { get; set; } // Số lượng máu (ml)
        public string? status { get; set; } // Trạng thái hiến máu (e.g., "Completed", "Pending")

        // Navigation
        [ForeignKey("user_id")]
        public User? User { get; set; }
        
        [ForeignKey("unit_id")]
        public BloodInventory? BloodInventory { get; set; }

    }
}
