using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.DonationHistoryRepo;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.Impl
{
    public class DonationHistoryRepository : IDonationHistoryRepository
    {
        private readonly AppDbContext _context;

        public DonationHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DonationHistory?> GetByIdAsync(int donationHistoryId)
        {
            return await _context.DonationHistories
                .Include(d => d.User)
                .Include(d => d.BloodInventory)
                .FirstOrDefaultAsync(d => d.donation_id == donationHistoryId);
        }

        public async Task<List<DonationHistory>> GetAllAsync()
        {
            return await _context.DonationHistories
                .Include(d => d.User)
                .Include(d => d.BloodInventory)
                .ToListAsync();
        }

        public async Task<List<DonationHistory>> GetByUserIdAsync(int userId)
        {
            return await _context.DonationHistories
                .Where(d => d.user_id == userId)
                .Include(d => d.User)
                .Include(d => d.BloodInventory)
                .ToListAsync();
        }

        public async Task<DonationHistory> AddAsync(DonationHistory donationHistory)
        {
            _context.DonationHistories.Add(donationHistory);
            await _context.SaveChangesAsync();
            return donationHistory;
        }

        public async Task<bool> UpdateAsync(DonationHistory donationHistory)
        {
            var existing = await _context.DonationHistories.FindAsync(donationHistory.donation_id);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(donationHistory);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int donationHistoryId)
        {
            var existing = await _context.DonationHistories.FindAsync(donationHistoryId);
            if (existing == null) return false;

            _context.DonationHistories.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
