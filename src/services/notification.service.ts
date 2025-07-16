import api from './api.service';
import { API_ENDPOINTS } from './api.config';
// import { Notification } from '@/components/ui/NotificationBell';

export interface Notification {
  notification_id: string;
  message: string;
  read_status: boolean;
  created_at: string;
  donation_request_id?: number;
  type?: 'event' | 'alert' | 'info' | 'request' | 'system';
}

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<{ $values: Notification[] }>(API_ENDPOINTS.GET_USER_NOTIFICATIONS);
      return response.data.$values || [];
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
      await api.delete(API_ENDPOINTS.NOTIFICATIONS.DISMISS(notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
      throw error;
    }
  }

  static async createNotification(data: {
    title: string;
    message: string;
    type?: Notification['type'];
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
      await api.post(API_ENDPOINTS.CREATE_STAFF, data);
    } catch (error) {
      console.error('Error sending staff notification:', error);
      throw error;
    }
  }
}

export default NotificationService; 