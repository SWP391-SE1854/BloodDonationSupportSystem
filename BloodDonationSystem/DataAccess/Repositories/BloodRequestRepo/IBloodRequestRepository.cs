using BloodDonationSystem.DataAccess.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BloodDonationSystem.DataAccess.Repositories.BloodRequestRepo
{
    public interface IBloodRequestRepository
    {
        Task<List<BloodRequest>> GetAllAsync();
        Task<BloodRequest?> GetByIdAsync(int id);
        Task AddAsync(BloodRequest request);
        Task UpdateAsync(BloodRequest request);
        Task DeleteAsync(int id);
    }
}