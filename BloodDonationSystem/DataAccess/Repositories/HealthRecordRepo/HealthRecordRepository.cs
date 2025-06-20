using Microsoft.EntityFrameworkCore;
using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.HealthRecordRepo;

public class HealthRecordRepository(AppDbContext context) : IHealthRecordRepository
{

    // Lấy tất cả hồ sơ sức khỏe hiến máu
    public async Task<List<HealthRecord>> GetAllAsync()
    {
        return await context.Health_Record.ToListAsync();
    }

    // Lấy hồ sơ theo ID
    public async Task<HealthRecord?> GetByIdAsync(int recordId)
    {
        return await context.Health_Record.FindAsync(recordId);
    }

    // Lấy hồ sơ theo UserId
    public async Task<HealthRecord?> GetByUserIdAsync(int userId)
    {
        return await context.Health_Record
            .SingleOrDefaultAsync(r => r.user_id == userId);
    }

    // Thêm hồ sơ mới
    public async Task AddAsync(HealthRecord record)
    {
        await context.Health_Record.AddAsync(record);
        await context.SaveChangesAsync();
    }

    // Cập nhật hồ sơ
    public async Task UpdateAsync(HealthRecord record)
    {
        context.Health_Record.Update(record);
        await context.SaveChangesAsync();
    }

    // Xóa hồ sơ theo ID
    public async Task DeleteAsync(int recordId)
    {
        var item = await context.Health_Record.FindAsync(recordId);
        if (item != null)
        {
            context.Health_Record.Remove(item);
            await context.SaveChangesAsync();

        }
    }
}

