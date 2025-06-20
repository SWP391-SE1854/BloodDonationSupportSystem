using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.BloodRequestRepo
{
    public class BloodRequestRepository : IBloodRequestRepository
    {
        private readonly AppDbContext _context;

        public BloodRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BloodRequest>> GetAllAsync()
        {
            return await _context.Blood_Requests.ToListAsync();
        }

        public async Task<BloodRequest?> GetByIdAsync(int id)
        {
            return await _context.Blood_Requests.FindAsync(id);
        }

        public async Task AddAsync(BloodRequest request)
        {
            await _context.Blood_Requests.AddAsync(request);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(BloodRequest request)
        {
            _context.Blood_Requests.Update(request);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.Blood_Requests.FindAsync(id);
            if (item != null)
            {
                _context.Blood_Requests.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}