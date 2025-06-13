using BloodDonationSystem.DataAccess.Entities;
using System.Threading.Tasks;

namespace BloodDonationSystem.DataAccess.Repositories.UserRepo;
public interface IUserRepository
{
    // Lấy user bằng email
    Task<User?> GetUserByEmailAsync(string email);

    // Thêm user mới
    Task AddUserAsync(User user);

    // Lấy user bằng ID 
    Task<User?> GetUserByIdAsync(int userId);

    // Cập nhật thông tin user 
    Task UpdateUserAsync(User user);

   

    // Lấy tất cả user
    Task<List<User>> GetAllUsersAsync();







}