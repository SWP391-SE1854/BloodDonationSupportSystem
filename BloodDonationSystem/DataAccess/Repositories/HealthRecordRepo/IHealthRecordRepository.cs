using BloodDonationSystem.DataAccess.Entities;
using System.Threading.Tasks;

namespace BloodDonationSystem.DataAccess.Repositories.HealthRecordRepo
{

    public interface IHealthRecordRepository
    {
        Task<HealthRecord?> GetByUserIdAsync(int userId);
        Task AddAsync(HealthRecord record);
        Task UpdateAsync(HealthRecord record);
        Task DeleteAsync(int recordId);

        // dành cho staff
        Task<List<HealthRecord>> GetAllAsync();
        Task<HealthRecord?> GetByIdAsync(int recordId);
    }

}
