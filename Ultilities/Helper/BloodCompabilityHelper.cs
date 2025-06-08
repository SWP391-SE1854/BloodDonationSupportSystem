namespace BloodDonationSystem.Utilities.Helper;

public static class BloodCompatibilityHelper
{
    private static readonly Dictionary<string, List<string>> CompatibilityMap = new()
    {
        { "O-", new() { "O-" } },
        { "O+", new() { "O-", "O+" } },
        { "A-", new() { "O-", "A-" } },
        { "A+", new() { "O-", "O+", "A-", "A+" } },
        { "B-", new() { "O-", "B-" } },
        { "B+", new() { "O-", "O+", "B-", "B+" } },
        { "AB-", new() { "O-", "A-", "B-", "AB-" } },
        { "AB+", new() { "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+" } },
    };

    public static bool CanDonateTo(string donorType, string recipientType)
    {
        return CompatibilityMap.ContainsKey(recipientType) && CompatibilityMap[recipientType].Contains(donorType);
    }
}