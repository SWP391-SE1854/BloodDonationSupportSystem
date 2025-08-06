import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DonationService } from '@/services/donation.service';
import { Donation } from '@/types/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, Heart, AlertCircle, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { getBloodTypeName } from '@/utils/bloodTypes';
import { useToast } from '@/components/ui/use-toast';

const statusTranslations: { [key: string]: string } = {
  Pending: 'Đang chờ',
  Approved: 'Đã phê duyệt',
  Completed: 'Đã hoàn thành',
  Rejected: 'Đã từ chối',
  Cancelled: 'Đã hủy',
  Processed: 'Đã xử lý',
  CheckedIn: 'Đã check-in',
};

const statusColors: { [key: string]: string } = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Approved: 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  Processed: 'bg-purple-100 text-purple-800 border-purple-200',
  CheckedIn: 'bg-green-100 text-green-800 border-green-200',
};

const statusIcons: { [key: string]: React.ReactNode } = {
  Pending: <Clock className="h-4 w-4 text-yellow-600" />,
  Approved: <CheckCircle className="h-4 w-4 text-blue-600" />,
  Completed: <CheckCircle className="h-4 w-4 text-green-600" />,
  Rejected: <XCircle className="h-4 w-4 text-red-600" />,
  Cancelled: <XCircle className="h-4 w-4 text-gray-600" />,
  Processed: <CheckCircle className="h-4 w-4 text-purple-600" />,
  CheckedIn: <CheckCircle className="h-4 w-4 text-green-600" />,
};

const CurrentDonationRequests = () => {
  const { data: donations, isLoading, error } = useQuery<Donation[]>({
    queryKey: ['memberCurrentDonations'],
    queryFn: async () => {
      const result = await DonationService.getMemberDonations();
      return result;
    },
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: vi });
    } catch {
      return 'Ngày không xác định';
    }
  };

  const activeDonations = donations?.filter(donation => 
    ['Pending', 'Approved', 'CheckedIn'].includes(donation.status)
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Yêu cầu hiến máu hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Yêu cầu hiến máu hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Lỗi khi tải dữ liệu
            </h3>
            <p className="text-sm text-gray-500">
              Không thể tải thông tin yêu cầu hiến máu. Vui lòng thử lại sau.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Yêu cầu hiến máu hiện tại
          {activeDonations.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {activeDonations.length} yêu cầu
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
             <CardContent>
         {activeDonations.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Không có yêu cầu hiến máu nào
            </h3>
            <p className="text-sm text-gray-500">
              Bạn chưa có yêu cầu hiến máu nào đang chờ xử lý.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDonations.map((donation) => (
              <div
                key={donation.donation_id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {statusIcons[donation.status] || <Clock className="h-4 w-4 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          Yêu cầu #{donation.donation_id}
                        </h4>
                        <Badge className={statusColors[donation.status] || 'bg-gray-100 text-gray-800 border-gray-200'}>
                          {statusTranslations[donation.status] || donation.status}
                        </Badge>
                      </div>
                      
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                         <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           <span>Ngày yêu cầu: {formatDate(donation.donation_date)}</span>
                         </div>
                         
                         {donation.start_time && donation.end_time && (
                           <div className="flex items-center gap-2">
                             <Clock className="h-4 w-4" />
                             <span>Thời gian: {donation.start_time} - {donation.end_time}</span>
                           </div>
                         )}
                         
                         <div className="flex items-center gap-2">
                           <MapPin className="h-4 w-4" />
                           <span>Địa điểm: {donation.location || 'BloodCare Center'}</span>
                         </div>
                         
                         {donation.note && (
                           <div className="flex items-center gap-2">
                             <span>Ghi chú: {donation.note}</span>
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentDonationRequests; 