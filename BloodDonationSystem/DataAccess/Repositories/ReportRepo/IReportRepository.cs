using System.Collections.Generic;
using System.Threading.Tasks;
using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.ReportRepo
{
    public interface IReportRepository
    {
        Task<List<Report>> GetAllAsync();
        Task<Report?> GetByIdAsync(int id);
        Task AddAsync(Report report);
        Task UpdateAsync(Report report);
    }
}
