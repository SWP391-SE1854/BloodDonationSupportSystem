using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class Location
    {
        [Key]
        public int location_id { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }

       
    }
}
