using BloodDonationSystem.DataAccess.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BloodDonationSystem.DataAccess.Repositories.DonationHistoryRepo
{
    public interface IDonationHistoryRepository
    {
        Task<DonationHistory?> GetByIdAsync(int donationHistoryId);
        Task<List<DonationHistory>> GetAllAsync();
        Task<List<DonationHistory>> GetByUserIdAsync(int userId);
        Task<DonationHistory> AddAsync(DonationHistory donationHistory);
        Task<bool> UpdateAsync(DonationHistory donationHistory);
        Task<bool> DeleteAsync(int donationHistoryId);
    }
}
