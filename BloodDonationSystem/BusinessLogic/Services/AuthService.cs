using static BCrypt.Net.BCrypt;
using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.UserRepo;
using BloodDonationSystem.BusinessLogic.IServices;

public class AuthService
    {
        private readonly IUserRepository _userRepo;

        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepo, IJwtService jwtService)
        {
            _userRepo = userRepo;
            _jwtService = jwtService;
    }

    // Đăng nhập bằng email/password
    public async Task<string?> LoginAsync(string email, string password)
    {
        var user = await _userRepo.GetUserByEmailAsync(email);
        if (user == null)
            return null;

        // Kiểm tra Role
        if (string.IsNullOrEmpty(user.role))
            throw new InvalidOperationException("User role is missing.");

        return _jwtService.GenerateToken(user);
    }


    // Đăng ký tài khoản mới
    public async Task<bool> RegisterAsync(User user, string password)
        {
            if (await _userRepo.GetUserByEmailAsync(user.email) != null)
                return false; // Email đã tồn tại

           
            await _userRepo.AddUserAsync(user);
            return true;
        }
}

