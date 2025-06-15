using Moq;
using NUnit.Framework;
using BloodDonationSystem.BusinessLogic.Services;
using BloodDonationSystem.DataAccess.Entities;
using BloodDonationSystem.DataAccess.Repositories.UserRepo;
using BloodDonationSystem.BusinessLogic.IServices;

namespace BloodDonationSystem.Tests.Services
{
    public class AuthServiceTests
    {
        private Mock<IUserRepository> _userRepoMock;
        private Mock<BloodDonationSystem.BusinessLogic.IServices.IJwtService> _jwtServiceMock;
        private AuthService _authService;

        [SetUp]
        public void Setup()
        {
            _userRepoMock = new Mock<IUserRepository>();
            _jwtServiceMock = new Mock<BloodDonationSystem.BusinessLogic.IServices.IJwtService>();
            _authService = new AuthService(_userRepoMock.Object, _jwtServiceMock.Object);

        }

        [Test]
        public async Task LoginAsync_ValidUser_ReturnsToken()
        {
            var user = new User { email = "string@ex.com", role = "Member", name = "abc" };
            _userRepoMock.Setup(r => r.GetUserByEmailAsync(user.email)).ReturnsAsync(user);
            _jwtServiceMock.Setup(j => j.GenerateToken(user)).Returns("mocked-token");

            var result = await _authService.LoginAsync(user.email, "string");

            Assert.That(result, Is.EqualTo("mocked-token"));
        }

        [Test]
        public async Task LoginAsync_UserNotFound_ReturnsNull()
        {
            _userRepoMock.Setup(r => r.GetUserByEmailAsync("string@ex.com")).ReturnsAsync((User?)null);

            var result = await _authService.LoginAsync("string@ex.com", "string");

            Assert.That(result, Is.Null);
        }

        [Test]
        public void LoginAsync_UserWithoutRole_ThrowsException()
        {
            var user = new User { email = "no-role@example.com", role = "member", name = "abc" };
            _userRepoMock.Setup(r => r.GetUserByEmailAsync(user.email)).ReturnsAsync(user);

            Assert.ThrowsAsync<InvalidOperationException>(() => _authService.LoginAsync(user.email, "pass"));
        }

        [Test]
        public async Task RegisterAsync_EmailExists_ReturnsFalse()
        {
            var user = new User { email = "exists@example.com", name = "abc" };
            _userRepoMock.Setup(r => r.GetUserByEmailAsync(user.email)).ReturnsAsync(user);

            var result = await _authService.RegisterAsync(user, "password");

            Assert.That(result, Is.False);
        }

        [Test]
        public async Task RegisterAsync_NewEmail_AddsUserAndReturnsTrue()
        {
            var user = new User { email = "new@example.com", name = "abc" };
            _userRepoMock.Setup(r => r.GetUserByEmailAsync(user.email)).ReturnsAsync((User?)null);
            _userRepoMock.Setup(r => r.AddUserAsync(user)).Returns(Task.CompletedTask);

            var result = await _authService.RegisterAsync(user, "password");

            Assert.That(result, Is.True);
            _userRepoMock.Verify(r => r.AddUserAsync(user), Times.Once);
        }
    }
}
