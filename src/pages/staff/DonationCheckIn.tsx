import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Clock, Search, User, Phone, Calendar, CheckSquare, Square } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import DonationService from '@/services/donation.service';
import { Donation } from '@/types/api';
import { StaffService } from '@/services/staff.service';
import { UserProfile } from '@/services/user.service';
import CheckInStats from '@/components/CheckInStats';
import EmptyState from '@/components/EmptyState';

interface DonationWithUser extends Donation {
  userName?: string;
  userPhone?: string;
  isCheckedIn?: boolean;
  id?: number; // Alias for donation_id
  appointment_date?: string; // Alias for donation_date
}

const DonationCheckIn = () => {
  const [donations, setDonations] = useState<DonationWithUser[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<DonationWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Lấy danh sách đăng ký hiến máu đã được duyệt và đã check-in
      const [approvedDonations, checkedInDonations] = await Promise.all([
        DonationService.getDonationsByStatus('Approved'),
        DonationService.getDonationsByStatus('CheckedIn')
      ]);
      
      // Kết hợp cả hai danh sách
      const allDonations = [...approvedDonations, ...checkedInDonations];
      
      // Lấy thông tin user cho mỗi donation
      const usersData = await StaffService.getAllMembers();
      const userMap = (usersData as UserProfile[]).reduce((acc, user) => {
        acc[user.user_id] = { name: user.name, phone: user.phone };
        return acc;
      }, {} as Record<string, { name: string; phone: string }>);

      // Kết hợp thông tin donation với user
      const donationsWithUser = allDonations.map(donation => ({
        ...donation,
        id: donation.donation_id, // Alias for compatibility
        appointment_date: donation.donation_date, // Alias for compatibility
        userName: userMap[donation.user_id]?.name || 'Không xác định',
        userPhone: userMap[donation.user_id]?.phone || 'Không xác định',
        isCheckedIn: donation.status === 'CheckedIn' // Kiểm tra trạng thái từ database
      }));

      setDonations(donationsWithUser);
      setFilteredDonations(donationsWithUser);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter donations based on search term and date
  useEffect(() => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.userPhone?.includes(searchTerm)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(donation => {
        const donationDate = new Date(donation.appointment_date || donation.donation_date).toISOString().split('T')[0];
        return donationDate === selectedDate;
      });
    }

    setFilteredDonations(filtered);
  }, [donations, searchTerm, selectedDate]);

  const handleCheckIn = async (donationId: number) => {
    try {
      // Gọi API để cập nhật trạng thái check-in
      await DonationService.updateDonationStatus(donationId, 'CheckedIn');
      
      // Cập nhật trạng thái check-in trong local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, isCheckedIn: true }
            : donation
        )
      );

      toast({
        title: 'Thành công',
        description: 'Đã check-in thành công!',
      });
    } catch (error) {
      console.error("Failed to check-in:", error);
      toast({
        title: 'Lỗi',
        description: 'Không thể check-in. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  const handleUncheckIn = async (donationId: number) => {
    try {
      // Gọi API để cập nhật trạng thái check-in
      await DonationService.updateDonationStatus(donationId, 'Approved');
      
      // Cập nhật trạng thái check-in trong local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, isCheckedIn: false }
            : donation
        )
      );

      toast({
        title: 'Thành công',
        description: 'Đã hủy check-in!',
      });
    } catch (error) {
      console.error("Failed to uncheck-in:", error);
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy check-in. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (isCheckedIn: boolean) => {
    return isCheckedIn ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Checked In
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        <Clock className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    );
  };

  const getRowClassName = (isCheckedIn: boolean) => {
    return `transition-colors duration-200 ${
      isCheckedIn 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white hover:bg-gray-50'
    }`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-in Người Hiến Máu</h1>
          <p className="text-gray-600 mt-1">
            Quản lý danh sách người đăng ký hiến máu và trạng thái check-in
          </p>
        </div>
      </div>

      {/* Statistics */}
      <CheckInStats
        totalDonations={filteredDonations.length}
        checkedInCount={filteredDonations.filter(d => d.isCheckedIn).length}
        pendingCount={filteredDonations.filter(d => !d.isCheckedIn).length}
        checkInRate={filteredDonations.length > 0 ? Math.round((filteredDonations.filter(d => d.isCheckedIn).length / filteredDonations.length) * 100) : 0}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedDate('');
              }}
              className="whitespace-nowrap"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Danh sách đăng ký hiến máu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDonations.length === 0 ? (
            <EmptyState
              title="Không có đăng ký hiến máu"
              description="Hiện tại không có đăng ký hiến máu nào để check-in"
              icon={<User className="w-12 h-12 text-gray-300" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">STT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Họ tên</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Số điện thoại</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Thời gian hẹn</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation, index) => (
                    <tr
                      key={donation.id}
                      className={`border-b border-gray-100 ${getRowClassName(donation.isCheckedIn || false)}`}
                    >
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {donation.userName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{donation.userPhone}</span>
                        </div>
                      </td>
                                             <td className="py-4 px-4">
                         <div className="flex items-center gap-2 text-gray-600">
                           <Calendar className="w-4 h-4" />
                           <span>
                             {format(new Date(donation.appointment_date || donation.donation_date), 'dd/MM/yyyy HH:mm', { locale: vi })}
                           </span>
                         </div>
                       </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(donation.isCheckedIn || false)}
                      </td>
                      <td className="py-4 px-4">
                        {donation.isCheckedIn ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUncheckIn(donation.id || donation.donation_id)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <Square className="w-4 h-4 mr-1" />
                            Hủy Checked In
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(donation.id || donation.donation_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckSquare className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Danh sách (Mobile)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDonations.map((donation, index) => (
                <div
                  key={donation.id}
                  className={`p-4 rounded-lg border ${getRowClassName(donation.isCheckedIn || false)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{donation.userName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {donation.userPhone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(donation.isCheckedIn || false)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(donation.appointment_date || donation.donation_date), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    {donation.isCheckedIn ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUncheckIn(donation.id || donation.donation_id)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <Square className="w-4 h-4 mr-1" />
                        Hủy Checked In
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(donation.id || donation.donation_id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckSquare className="w-4 h-4 mr-1" />
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationCheckIn; 