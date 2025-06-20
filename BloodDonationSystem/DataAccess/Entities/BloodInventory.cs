using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities;
public class BloodInventory
{
    [Key]
    public int unit_id { get; set; }
    public int donation_id { get; set; }
    public int blood_type { get; set; }
    public string status { get; set; } = string.Empty;
    public int quantity { get; set; }
    public DateTime expiration_date { get; set; }

    // Navigation
    [ForeignKey("donation_id")]
    public Donation? Donation { get; set; }
}
