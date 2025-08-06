import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DonationHistoryService, DonationHistoryRecord } from '@/services/donation-history.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Droplets, Heart, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { getBloodTypeName } from '@/utils/bloodTypes';

type DonationHistoryServerResponse = DonationHistoryRecord[] | { $values: DonationHistoryRecord[] };

const statusTranslations: { [key: string]: string } = {
  CheckedIn: 'Đã hiến máu',
  Approved: 'Đã phê duyệt',
  Completed: 'Đã hoàn thành',
  Rejected: 'Đã từ chối',
  Expired: 'Hết hạn',
  Cancelled: 'Đã hủy',
};

const MemberDonationHistory = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: donations, isLoading, isError, error } = useQuery<DonationHistoryRecord[], Error>({
    queryKey: ['memberDonationHistory', statusFilter],
    queryFn: async () => {
      const response: DonationHistoryServerResponse = await DonationHistoryService.getMemberHistory(statusFilter || undefined);
      if (response && '$values' in response) {
        return Array.isArray(response.$values) ? response.$values : [];
      }
      return Array.isArray(response) ? response : [];
    },
  });

  const filteredDonations = useMemo(() => {
    if (!donations) return [];
    
    return donations.filter(donation => {
      const matchesSearch = searchTerm === '' || 
        donation.history_id.toString().includes(searchTerm) ||
        donation.donation_date.includes(searchTerm) ||
        (donation.blood_type && donation.blood_type.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [donations, searchTerm]);

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status.toLowerCase()) {
      case 'checkedin':
        return 'default';
      case 'approved':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'rejected':
      case 'expired':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'checkedin':
        return <Heart className="h-4 w-4 text-green-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'expired':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDonationDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: vi });
    } catch {
      return 'Ngày không xác định';
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error?.message || 'Không thể tải lịch sử hiến máu.'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử hiến máu</h1>
        <p className="text-gray-600 mt-2">Hồ sơ chi tiết về các hoạt động hiến máu của bạn</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-red-500" />
              Lịch sử hiến máu
              {filteredDonations.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {filteredDonations.length} bản ghi
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo ID, ngày, nhóm máu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="CheckedIn">Đã hiến máu</SelectItem>
                  <SelectItem value="Approved">Đã phê duyệt</SelectItem>
                  <SelectItem value="Completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="Rejected">Đã từ chối</SelectItem>
                  <SelectItem value="Expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
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
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm || statusFilter ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử hiến máu'}
              </h3>
              <p className="text-sm text-gray-500">
                {searchTerm || statusFilter 
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Bạn chưa có bản ghi hiến máu nào trong hệ thống.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div
                  key={donation.history_id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(donation.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Hiến máu #{donation.history_id}
                          </h4>
                          <Badge variant={getStatusBadgeVariant(donation.status)}>
                            {statusTranslations[donation.status] || donation.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Ngày hiến: {formatDonationDate(donation.donation_date)}</span>
                          </div>
                          
                                                     {donation.blood_type && (
                             <div className="flex items-center gap-2">
                               <Droplets className="h-4 w-4" />
                               <span>Nhóm máu: {donation.blood_type}</span>
                             </div>
                           )}
                          
                          {donation.unit_id && (
                            <div className="flex items-center gap-2">
                              <span>Mã đơn vị: #{donation.unit_id}</span>
                            </div>
                          )}
                          
                          {donation.bloodInventory?.quantity && (
                            <div className="flex items-center gap-2">
                              <span>Số lượng: {donation.bloodInventory.quantity}ml</span>
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
    </div>
  );
};

export default MemberDonationHistory;
