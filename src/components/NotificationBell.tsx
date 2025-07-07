import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'request' | 'system';
  createdAt: string;
  read: boolean;
}

interface NotificationBellProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 text-sm font-medium text-gray-900 border-b">
          Thông Báo
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? 'bg-red-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div>
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có thông báo mới
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 