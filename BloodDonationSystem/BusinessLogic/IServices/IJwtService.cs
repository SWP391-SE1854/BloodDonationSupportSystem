using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.BusinessLogic.IServices
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}