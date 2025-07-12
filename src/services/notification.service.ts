import api from './api.service';
import { API_ENDPOINTS } from './api.config';
import { Notification } from '@/components/ui/NotificationBell';
import AdminService from './admin.service';

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<{ $values: Notification[] }>(API_ENDPOINTS.NOTIFICATIONS.GET_ALL);
      return response.data.$values || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
    await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
    await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async dismissNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.NOTIFICATIONS.DISMISS(notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
      throw error;
    }
  }

  static async createNotification(data: {
    title: string;
    message: string;
    type: Notification['type'];
    userId?: string;
  }): Promise<Notification> {
    try {
      const response = await api.post<Notification>(API_ENDPOINTS.NOTIFICATIONS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async sendProblemReportToAdmins(data: { title: string; message: string }): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await api.post(API_ENDPOINTS.NOTIFICATIONS.SEND_PROBLEM_REPORT, {
        token,
        title: data.title,
        body: data.message,
      });
    } catch (error) {
      console.error('Error sending problem report to admins:', error);
      throw error;
    }
  }

  // Mock data for development
  static getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        title: 'Sự Kiện Hiến Máu Mới',
        message: 'Sự kiện hiến máu sẽ diễn ra vào ngày 15/07/2025 tại Bệnh viện. Đăng ký ngay!',
        type: 'event',
        createdAt: '2025-07-04T08:00:00Z',
        read: false
      },
      {
        id: '2',
        title: 'Yêu Cầu Hiến Máu Khẩn Cấp',
        message: 'Cần gấp nhóm máu O+ cho ca phẫu thuật. Vui lòng liên hệ nếu bạn có thể hỗ trợ.',
        type: 'request',
        createdAt: '2025-07-04T07:30:00Z',
        read: false
      },
      {
        id: '3',
        title: 'Cập Nhật Hồ Sơ Sức Khỏe',
        message: 'Vui lòng cập nhật thông tin sức khỏe của bạn trước ngày 10/07/2025.',
        type: 'system',
        createdAt: '2025-07-03T15:00:00Z',
        read: true
      }
    ];
  }
}

export default NotificationService; 