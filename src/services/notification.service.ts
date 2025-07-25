import api from './api.service';
import { API_ENDPOINTS } from './api.config';
// import { Notification } from '@/components/ui/NotificationBell';

export interface Notification {
  notification_id: string;
  title: string;
  message: string;
  read_status: boolean;
  sent_date: string;
  donation_request_id?: number;
}

interface ApiNotification {
  notification_id: string;
  title: string;
  message: string;
  read_status: boolean;
  sent_date: string;
  donation_request_id?: number;
}

export class NotificationService {
  private static transform(notification: ApiNotification): Notification {
    return {
      notification_id: String(notification.notification_id),
      title: notification.title,
      message: notification.message,
      read_status: notification.read_status,
      sent_date: notification.sent_date,
      donation_request_id: notification.donation_request_id,
    };
  }

  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<{ $values: ApiNotification[] }>(API_ENDPOINTS.GET_USER_NOTIFICATIONS);
      if (response.data && response.data.$values) {
        return response.data.$values.map(this.transform);
      }
      return [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.put(API_ENDPOINTS.MARK_NOTIFICATION_AS_READ(notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /*
  // No endpoint for this yet
  static async markAllAsRead(): Promise<void> {
    try {
    // await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
  */

  static async dismissNotification(notificationId: string): Promise<void> {
    try {
      // Assuming there is an endpoint for dismissing
      // await api.delete(`/api/notification/member/${notificationId}`);
    } catch (error) {
      console.error('Error dismissing notification:', error);
      throw error;
    }
  }

  static async createNotification(data: {
    title: string;
    message: string;
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

  static async sendStaffNotification(data: { user_id: string; title: string; message: string }): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.CREATE_STAFF, {
        user_id: parseInt(data.user_id, 10),
        title: data.title,
        message: data.message,
        read_status: false,
        sent_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending staff notification:', error);
      throw error;
    }
  }
}

export default NotificationService; 