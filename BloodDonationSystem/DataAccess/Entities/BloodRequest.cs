using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities;
public class BloodRequest
{
    [Key]
    public int request_id { get; set; }
    public int user_id { get; set; }
    public int blood_id { get; set; }
    public bool emergency_status { get; set; }
    public DateTime request_date { get; set; }
    public DateTime end_date { get; set; }
    public int donor_count { get; set; }
    public string? location_donate { get; set; }
    // Navigation
    [ForeignKey("user_id")]
    public User? User { get; set; }

  
}