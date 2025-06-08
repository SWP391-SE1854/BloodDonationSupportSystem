using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.DataAccess.Entities;
public class BloodPost
{
    [Key]
    public int PostId { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
}
