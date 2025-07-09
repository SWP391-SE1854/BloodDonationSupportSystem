import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/components/ui/NotificationBell';
import NotificationService from '@/services/notification.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await NotificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  const handleDismiss = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.dismissNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('Error dismissing notification:', err);
    }
  }, []);

  const createNotification = useCallback(async (data: {
    title: string;
    message: string;
    type: Notification['type'];
    userId?: string;
  }) => {
    try {
      const newNotification = await NotificationService.createNotification(data);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      console.error('Error creating notification:', err);
      throw err;
    }
  }, []);

  return {
    notifications,
    isLoading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    dismiss: handleDismiss,
    createNotification,
    refresh: fetchNotifications
  };
} 