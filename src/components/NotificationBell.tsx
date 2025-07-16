import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
        )}
                </Button>
      </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                <DropdownMenuSeparator />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                            key={notification.notification_id}
                            onSelect={() => !notification.read_status && markAsRead(notification.notification_id)}
                            className={`whitespace-normal ${!notification.read_status ? 'font-bold' : ''}`}
                        >
                            <div className="flex flex-col gap-1">
                                {notification.donation_request_id ? (
                                    <>
                                        <p className="font-semibold">Yêu cầu hiến máu bị từ chối</p>
                                        <p className="text-sm">Lý do: {notification.message}</p>
                                    </>
                                ) : (
                                    <p>{notification.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
                    <DropdownMenuItem>Không có thông báo mới</DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 