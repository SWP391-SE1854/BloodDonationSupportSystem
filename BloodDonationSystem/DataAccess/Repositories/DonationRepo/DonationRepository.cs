using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.DonationRepo
{
    public class DonationRepository : IDonationRepository
    {
        private readonly AppDbContext _context;

        public DonationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Donation?> GetByIdAsync(int donationId)
        {
            return await _context.Set<Donation>().FindAsync(donationId);
        }

        public async Task<List<Donation>> GetAllAsync()
        {
            return await _context.Set<Donation>().ToListAsync();
        }

        public async Task<Donation> AddAsync(Donation donation)
        {
            _context.Set<Donation>().Add(donation);
            await _context.SaveChangesAsync();
            return donation;
        }

        public async Task<bool> UpdateAsync(Donation donation)
        {
            var existing = await _context.Set<Donation>().FindAsync(donation.donation_id);
            if (existing == null)
                return false;

            _context.Entry(existing).CurrentValues.SetValues(donation);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int donationId)
        {
            var donation = await _context.Set<Donation>().FindAsync(donationId);
            if (donation == null)
                return false;

            _context.Set<Donation>().Remove(donation);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}