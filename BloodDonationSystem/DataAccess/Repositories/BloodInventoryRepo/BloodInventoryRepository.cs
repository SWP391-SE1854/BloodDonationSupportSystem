using BloodDonationSystem.DataAccess.Entities;
using Google;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.BloodInventoryRepo
{
    public class BloodInventoryRepository : IBloodInventoryRepository
    {
        private readonly AppDbContext _context;

        public BloodInventoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BloodInventory>> GetAllAsync()
        {
            return await _context.Blood_Inventory
                .Include(b => b.Donation)
                .ToListAsync();
        }

        public async Task<BloodInventory?> GetByIdAsync(int id)
        {
            return await _context.Blood_Inventory
                .Include(b => b.Donation)
                .FirstOrDefaultAsync(b => b.unit_id == id);
        }

        public async Task AddAsync(BloodInventory unit)
        {
            _context.Blood_Inventory.Add(unit); // Corrected DbSet reference
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(BloodInventory unit)
        {
            _context.Blood_Inventory.Update(unit); // Corrected DbSet reference
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var unit = await _context.Blood_Inventory.FindAsync(id);
            if (unit != null)
            {
                _context.Blood_Inventory.Remove(unit); // Corrected DbSet reference
                await _context.SaveChangesAsync();
            }
        }
    }
}
