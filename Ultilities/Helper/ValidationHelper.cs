using System.Text.RegularExpressions;

namespace BloodDonationSystem.Utilities.Helper
{
    public static class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        public static bool IsValidPhoneNumber(string number)
        {
            return Regex.IsMatch(number, @"^\+?\d{9,15}$");
        }



        public static bool IsStrongPassword(string password)
        {
            return password.Length >= 8 &&
                   Regex.IsMatch(password, @"[A-Z]") &&
                   Regex.IsMatch(password, @"[a-z]") &&
                   Regex.IsMatch(password, @"[0-9]");
        }
    }
}