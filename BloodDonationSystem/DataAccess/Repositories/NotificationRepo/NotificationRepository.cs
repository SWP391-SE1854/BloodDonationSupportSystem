using BloodDonationSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.DataAccess.Repositories.NotificationRepo
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Notification?> GetByIdAsync(int notificationId)
        {
            return await _context.Set<Notification>().FindAsync(notificationId);
        }

        public async Task<List<Notification>> GetAllAsync()
        {
            return await _context.Set<Notification>().ToListAsync();
        }

        public async Task<Notification> AddAsync(Notification notification)
        {
            _context.Set<Notification>().Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<bool> UpdateAsync(Notification notification)
        {
            var existing = await _context.Set<Notification>().FindAsync(notification.notification_id);
            if (existing == null)
                return false;

            _context.Entry(existing).CurrentValues.SetValues(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int notificationId)
        {
            var notification = await _context.Set<Notification>().FindAsync(notificationId);
            if (notification == null)
                return false;

            _context.Set<Notification>().Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}