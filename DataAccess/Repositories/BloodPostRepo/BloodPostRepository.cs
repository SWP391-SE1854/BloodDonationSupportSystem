using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.BloodPostRepo
{
    public class BloodPostRepository : IBloodPostRepository
    {
        private readonly AppDbContext _context;

        public BloodPostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BloodPost>> GetAllAsync()
        {
            return await _context.Blood_Post.ToListAsync();
        }

        public async Task<BloodPost?> GetByIdAsync(int id)
        {
            return await _context.Blood_Post.FindAsync(id);
        }

        public async Task<BloodPost> AddAsync(BloodPost post)
        {
            var entry = await _context.Blood_Post.AddAsync(post);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<bool> UpdateAsync(BloodPost post)
        {
            _context.Blood_Post.Update(post);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _context.Blood_Post.FindAsync(id);
            if (item != null)
            {
                _context.Blood_Post.Remove(item);
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            return false;
        }
    }
}