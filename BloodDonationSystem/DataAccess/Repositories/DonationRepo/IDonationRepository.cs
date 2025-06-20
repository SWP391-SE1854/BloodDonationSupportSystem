using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.DonationRepo
{
    public interface IDonationRepository
    {
        Task<Donation?> GetByIdAsync(int donationId);
        Task<List<Donation>> GetAllAsync();
        Task<Donation> AddAsync(Donation donation);
        Task<bool> UpdateAsync(Donation donation);
        Task<bool> DeleteAsync(int donationId);
    }
}