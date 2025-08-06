import React, { useState } from 'react';
import { Bell, Heart, Droplets, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

const NotificationForm = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const getNotificationIcon = (notification: any) => {
    if (notification.title?.includes('phê duyệt') || notification.message?.includes('phê duyệt')) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (notification.title?.includes('từ chối') || notification.message?.includes('từ chối')) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    if (notification.title?.includes('Cảm ơn') || notification.message?.includes('cứu người')) {
      return <Heart className="h-5 w-5 text-red-500" />;
    }
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  const getNotificationStyle = (notification: any) => {
    if (notification.title?.includes('Cảm ơn') || notification.message?.includes('cứu người')) {
      return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
    }
    if (notification.title?.includes('phê duyệt') || notification.message?.includes('phê duyệt')) {
      return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
    }
    if (notification.title?.includes('từ chối') || notification.message?.includes('từ chối')) {
      return 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200';
    }
    return 'bg-white border-gray-200';
  };

  const getNotificationBadge = (notification: any) => {
    if (notification.title?.includes('Cảm ơn') || notification.message?.includes('cứu người')) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
        Đã cứu được một mạng sống
      </Badge>;
    }
    if (notification.title?.includes('phê duyệt') || notification.message?.includes('phê duyệt')) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
        Đã phê duyệt
      </Badge>;
    }
    if (notification.title?.includes('từ chối') || notification.message?.includes('từ chối')) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-xs">
        Đã từ chối
      </Badge>;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo ({notifications.length})
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} mới
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const isRead = notification.read_status;
                const icon = getNotificationIcon(notification);
                const style = getNotificationStyle(notification);
                const badge = getNotificationBadge(notification);

                return (
                  <Card 
                    key={notification.notification_id}
                    className={`${style} ${!isRead ? 'ring-2 ring-blue-200' : ''} transition-all duration-200 hover:shadow-md cursor-pointer`}
                    onClick={() => handleNotificationClick(notification.notification_id, isRead)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={`font-semibold mb-2 ${!isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              {badge && (
                                <div className="mb-2">
                                  {badge}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(notification.sent_date), 'PPP p')}
                                </p>
                                {!isRead && (
                                  <Badge variant="outline" className="text-xs">
                                    Mới
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Không có thông báo
                </h3>
                <p className="text-sm text-gray-500">
                  Bạn sẽ nhận được thông báo khi có cập nhật mới
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationForm; 