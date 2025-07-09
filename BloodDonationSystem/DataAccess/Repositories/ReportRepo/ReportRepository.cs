using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.ReportRepo
{
    public class ReportRepository : IReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Report>> GetAllAsync()
        {
            return await _context.Reports.Include(r => r.User).ToListAsync();
        }

        public async Task<Report?> GetByIdAsync(int id)
        {
            var report = await _context.Reports.Include(r => r.User)
                                               .FirstOrDefaultAsync(r => r.ReportId == id);

            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {id} not found.");
            }
            return report;
        }

        public async Task AddAsync(Report report)
        {
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Report report)
        {
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }
    }
}
