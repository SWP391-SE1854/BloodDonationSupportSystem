import { Bell, Heart, Droplets } from 'lucide-react';
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
import { format } from 'date-fns';
import { Badge } from './ui/badge';

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
            notifications.map((notification) => {
              // Kiểm tra xem có phải thông báo cám ơn không
              const isThankYouNotification = notification.title?.includes('💖') || notification.message?.includes('cứu người');
              
              return (
                <DropdownMenuItem
                  key={notification.notification_id}
                  onSelect={() => !notification.read_status && markAsRead(notification.notification_id)}
                  className={`whitespace-normal ${!notification.read_status ? 'font-bold' : ''}`}
                >
                  <div className="flex flex-col gap-1 w-full">
                    {isThankYouNotification ? (
                      // Hiển thị thông báo cám ơn với styling đặc biệt
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-2 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <p className="font-semibold text-red-700">{notification.title}</p>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                          Đã cứu được một mạng sống
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(notification.sent_date), 'PPP p')}
                        </p>
                      </div>
                    ) : notification.donation_request_id ? (
                      // Thông báo từ chối yêu cầu hiến máu
                      <>
                        <p className="font-semibold">Yêu cầu hiến máu bị từ chối</p>
                        <p className="text-sm">Lý do: {notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notification.sent_date), 'PPP p')}
                        </p>
                      </>
                    ) : (
                      // Thông báo thông thường
                      <>
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notification.sent_date), 'PPP p')}
                        </p>
                      </>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
                    <DropdownMenuItem>Không có thông báo mới</DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 