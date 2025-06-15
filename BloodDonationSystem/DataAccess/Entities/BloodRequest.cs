using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.DataAccess.Entities;
public class BloodRequest
{
    [Key]
    public int request_id { get; set; }
    public int user_id { get; set; }
    public int blood_id { get; set; }
    public bool emergency_status { get; set; }
    public DateTime request_date { get; set; }
    public int location_id { get; set; }
}