namespace BloodDonationSystem.Utilities.Helper
{
    public static class DateHelper
    {
        public static bool IsFutureDate(DateTime date) => date > DateTime.Now;

        public static int CalculateAge(DateTime birthDate)
        {
            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;
            if (birthDate.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}