using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.LocationRepo
{
    public interface ILocationRepository
    {
        Task<Location?> GetByIdAsync(int locationId);
        Task<List<Location>> GetAllAsync();
        Task<Location> AddAsync(Location location);
        Task<bool> UpdateAsync(Location location);
        Task<bool> DeleteAsync(int locationId);
    }
}