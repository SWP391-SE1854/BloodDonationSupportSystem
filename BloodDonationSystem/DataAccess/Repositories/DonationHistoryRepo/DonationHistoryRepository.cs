using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodDonationSystem.DataAccess.Repositories.DonationHistoryRepo
{
    public class DonationHistoryRepository : IDonationHistoryRepository
    {
        private readonly AppDbContext _context;

        public DonationHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DonationHistory> AddAsync(DonationHistory donationHistory)
        {
            _context.DonationHistories.Add(donationHistory);
            await _context.SaveChangesAsync();
            return donationHistory;
        }

        public async Task<DonationHistory> GetByIdAsync(int id)
        {
            return await _context.DonationHistories.FindAsync(id);
        }

        public async Task<IEnumerable<DonationHistory>> GetByUserIdAsync(int userId)
        {
            return await _context.DonationHistories
                .Where(h => h.user_id == userId)
                .OrderByDescending(h => h.donation_date)
                .ToListAsync();
        }
    }
} 