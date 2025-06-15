using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities;
public class HealthRecord
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int record_id { get; set; }

    public int user_id { get; set; }
    public double weight { get; set; }
    public double height { get; set; }
    public string blood_type { get; set; } = null!;
    public string allergies { get; set; } = null!;
    public string medication { get; set; } = null!;
    public DateTime last_donation { get; set; }
    public bool? eligibility_status { get; set; } = false;
    public int donation_count { get; set; }


    public class UpdateRecordsDto
    {
        public bool? eligibility_status { get; set; }
        public bool increment_donation { get; set; }
    }


    // Navigation
    [ForeignKey("user_id")]
    public User? User { get; set; )

    
 }
