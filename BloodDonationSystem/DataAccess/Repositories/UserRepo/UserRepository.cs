using Microsoft.EntityFrameworkCore;
using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.Utilities.Helper;

namespace BloodDonationSystem.DataAccess.Repositories.UserRepo;
public class UserRepository(AppDbContext context) : IUserRepository
{
    // Lấy user bằng email
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await context.Users
         
            .FirstOrDefaultAsync(u => u.email == email);
    }

    // Thêm user mới
    public async Task AddUserAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    // Lấy user bằng ID
    public async Task<User?> GetUserByIdAsync(int userId)
        => await context.Users.FindAsync(userId);

    // Cập nhật user
    public async Task UpdateUserAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }
    public async Task<List<User>> GetAllUsersAsync()
    {
        return await context.Users.ToListAsync();
    }
    // Example using Entity Framework Core
    public async Task<List<User>> GetUsersByBloodCompatibilityAsync(string recipientBloodType)
    {
        return await context.Users
            .Join(context.Health_Record,
                  user => user.user_id,
                  record => record.user_id,
                  (user, record) => new { user, record })
            .Where(x => !string.IsNullOrEmpty(x.record.blood_type) &&
                        BloodCompatibilityHelper.CanDonateTo(x.record.blood_type, recipientBloodType))
            .Select(x => x.user)
            .ToListAsync();
    }

}
