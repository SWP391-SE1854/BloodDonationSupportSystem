using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.BloodInventoryRepo
{
    public interface IBloodInventoryRepository
    {
        Task<List<BloodInventory>> GetAllAsync();
        Task<BloodInventory?> GetByIdAsync(int id);
        Task AddAsync(BloodInventory unit);
        Task UpdateAsync(BloodInventory unit);
        Task DeleteAsync(int id);
    }
}
