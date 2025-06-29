using BloodDonationSystem.DataAccess.Entities;

namespace BloodDonationSystem.DataAccess.Repositories.NotificationRepo
{
    public interface INotificationRepository
    {
        Task<Notification?> GetByIdAsync(int notificationId);
        Task<List<Notification>> GetAllAsync();
        Task<Notification> AddAsync(Notification notification);
        Task<bool> UpdateAsync(Notification notification);
        Task<bool> DeleteAsync(int notificationId);
    }
}