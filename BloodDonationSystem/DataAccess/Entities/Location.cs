using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class Location
    {
        [Key]
        public int location_id { get; set; }
        public string name { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public double latitude { get; set; }
        public double longitude { get; set; }

        // Navigation
        public ICollection<BloodRequest>? BloodRequests { get; set; }
    }
}
