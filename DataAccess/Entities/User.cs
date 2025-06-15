using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodDonationSystem.DataAccess.Entities
{
    public class User
    {
        [Key]
        public int user_id { get; set; }
        public required string name { get; set; }
        [EmailAddress]
        public required string email { get; set; }
        public string? phone { get; set; }
        public DateTime? dob { get; set; }
        public string role { get; set; } = string.Empty!;
        public string? address { get; set; } // Địa chỉ người dùng
        public string? city { get; set; } // Thành phố người dùng
        public string? district { get; set; } // Quận huyện người dùng
        public int location_id { get; set; }


        //Navigation
        [ForeignKey("location_id")]
        public Location? Location { get; set; }

    }
}
