using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.LocationRepo
{
    public class LocationRepository : ILocationRepository
    {
        private readonly AppDbContext _context;

        public LocationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Location?> GetByIdAsync(int locationId)
        {
            return await _context.Set<Location>().FindAsync(locationId);
        }

        public async Task<List<Location>> GetAllAsync()
        {
            return await _context.Set<Location>().ToListAsync();
        }

        public async Task<Location> AddAsync(Location location)
        {
            _context.Set<Location>().Add(location);
            await _context.SaveChangesAsync();
            return location;
        }

        public async Task<bool> UpdateAsync(Location location)
        {
            var existing = await _context.Set<Location>().FindAsync(location.location_id);
            if (existing == null)
                return false;

            _context.Entry(existing).CurrentValues.SetValues(location);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int locationId)
        {
            var location = await _context.Set<Location>().FindAsync(locationId);
            if (location == null)
                return false;

            _context.Set<Location>().Remove(location);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}