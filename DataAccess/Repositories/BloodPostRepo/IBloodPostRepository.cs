using BloodDonationSystem.DataAccess.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBloodPostRepository
{
    Task<List<BloodPost>> GetAllAsync();
    Task<BloodPost?> GetByIdAsync(int id);
    Task<BloodPost> AddAsync(BloodPost post);
    Task<bool> UpdateAsync(BloodPost post);
    Task<bool> DeleteAsync(int id);
}
