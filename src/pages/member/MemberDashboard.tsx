import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Calendar, FileText, Activity, Droplet, Bell, AlertCircle, Clock, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import { DonationHistoryService, DonationHistoryRecord } from '@/services/donation-history.service';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { calculateNextEligibleDate, getWaitingPeriod, getLatestDonation } from '@/utils/donationConstants';
import { isEligibleByHistory } from '@/utils/donationConstants';
import NotificationBell from '@/components/NotificationBell';
import NotificationService, { Notification } from '@/services/notification.service';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BloodRequestService, BloodRequest } from '@/services/blood-request.service';
import { DonationService } from '@/services/donation.service';
import { Donation } from '@/types/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import MemberDonationRequest from './MemberDonationRequest';
import { getBloodTypeName } from '@/utils/bloodTypes';


const statusTranslations: { [key: string]: string } = {
  Pending: 'Đang chờ',
  Approved: 'Đã duyệt',
  Completed: 'Đã hoàn thành',
  Rejected: 'Đã từ chối',
  Cancelled: 'Đã hủy',
};

type HistoryServerResponse = DonationHistoryRecord[] | { $values: DonationHistoryRecord[] };

interface MemberDashboardProps {
  onNavigate: (page: string) => void;
}

interface BloodRequestServerResponse {
  $values?: BloodRequest[];
}

const MemberDashboard = ({ onNavigate }: MemberDashboardProps) => {
  const { user } = useAuth();
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [history, setHistory] = useState<DonationHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<BloodRequest[]>([]);
  // const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const navigate = useNavigate();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | undefined>(undefined);
  const [reportTitle, setReportTitle] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const { toast } = useToast();

  // Calculate total successful donations (excluding rejected/failed)
  const totalSuccessfulDonations = useMemo(() => {
    return history.filter(donation => {
      const status = donation.status.toLowerCase();
      return status === 'completed' || status === 'approved';
    }).length;
  }, [history]);

  // Calculate eligibility and waiting period
  const { isEligible, lastDonation, waitingPeriod, nextEligibleDate } = useMemo(() => {
    const nextDate = calculateNextEligibleDate(history);
    const latestDonation = getLatestDonation(history);
    const componentWaitingPeriod = latestDonation?.bloodInventory?.component ? getWaitingPeriod(latestDonation.bloodInventory.component) : 0;

    return {
      isEligible: isEligibleByHistory(history),
      lastDonation: latestDonation,
      waitingPeriod: componentWaitingPeriod,
      nextEligibleDate: nextDate ? format(nextDate, 'PPP') : 'Now'
    };
  }, [history]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const historyPromise = DonationHistoryService.getMemberHistory() as Promise<HistoryServerResponse>;
        const healthRecordPromise = HealthRecordService.getMyRecord();
        const [requestsData, donationsData] = await Promise.all([
          BloodRequestService.getAllBloodRequests(),
          DonationService.getMemberDonations()
        ]);

        const [historyData, recordData] = await Promise.all([
          historyPromise, 
          healthRecordPromise.catch(error => {
            console.error('Error fetching health record:', error);
            return null;
          })
        ]);

        if (historyData && '$values' in historyData) {
          setHistory(Array.isArray(historyData.$values) ? historyData.$values : []);
        } else if (Array.isArray(historyData)) {
          setHistory(historyData);
        } else {
          setHistory([]);
        }

        console.log('Health record data received:', recordData);
        if (recordData) {
          setHealthRecord(recordData);
          console.log('Blood type from API:', recordData.blood_type);
        } else {
          console.log('No health record data received');
        }

        // Filter and sort blood requests
        const activeRequests = Array.isArray(requestsData) 
          ? requestsData 
          : (requestsData as BloodRequestServerResponse).$values || [];

        const sortedRequests = activeRequests.sort((a, b) => {
          if (a.emergency_status && !b.emergency_status) return -1;
          if (!a.emergency_status && b.emergency_status) return 1;
          return new Date(b.request_date).getTime() - new Date(a.request_date).getTime();
        });

        setBloodRequests(sortedRequests);
        setEmergencyRequests(sortedRequests.filter(r => r.emergency_status));

        // Filter and sort recent donations
        // const sortedDonations = donationsData
        //   .filter(d => d.status === 'Pending' || d.status === 'Approved')
        //   .sort((a, b) => new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime())
        //   .slice(0, 5);
        // setRecentDonations(sortedDonations);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const fetchedNotifications = await NotificationService.getNotifications();
            setNotifications(fetchedNotifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setNotifications([]); // Set to empty array on error
        }
    };

    if (user?.id) {
        fetchNotifications();
    }
  }, [user]);

  const handleReportProblem = async () => {
    if (!reportTitle || !reportMessage) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập cả tiêu đề và nội dung.",
        variant: "destructive",
      });
      return;
    }
    try {
      await NotificationService.sendProblemReportToAdmins({
        title: reportTitle,
        message: reportMessage,
      });
      toast({
        title: "Thành công",
        description: "Báo cáo của bạn đã được gửi đến quản trị viên.",
      });
      setIsReportDialogOpen(false);
      setReportTitle('');
      setReportMessage('');
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi báo cáo. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const memberStats = [
    { 
      title: 'Tổng Lần Hiến Thành Công', 
      value: totalSuccessfulDonations, 
      icon: Heart, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100' 
    },
    { 
      title: 'Nhóm Máu', 
      value: getBloodTypeName(healthRecord?.blood_type || null), 
      icon: Droplet, 
      color: healthRecord?.blood_type ? 'text-blue-600' : 'text-gray-600', 
      bgColor: healthRecord?.blood_type ? 'bg-blue-100' : 'bg-gray-100' 
    },
    
    { 
      title: 'Lần Hiến Tiếp Theo', 
      value: isEligible ? 'Ngay bây giờ' : `${waitingPeriod} ngày`, 
      description: lastDonation 
        ? `Lần hiến gần nhất (${lastDonation.bloodInventory?.component || 'N/A'}): ${format(new Date(lastDonation.donation_date), 'PPP')}` 
        : 'Chưa có lần hiến nào',
      subtext: !isEligible ? `Đủ điều kiện vào: ${nextEligibleDate}` : 'Bạn đủ điều kiện hiến máu',
      icon: Calendar, 
      color: isEligible ? 'text-green-600' : 'text-red-600', 
      bgColor: isEligible ? 'bg-green-100' : 'bg-red-100' 
    }
  ];

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleDonateNow = (request: BloodRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(undefined);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section with Notification Bell */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.displayName ?? 'Thành viên'}!</h1>
            <p className="text-red-100 text-lg">Cảm ơn bạn đã tham gia hiến máu cứu người.</p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberStats.map((stat, index) => (
          <Card key={index} className={`shadow-lg border-l-4 ${stat.bgColor.replace('bg-', 'border-')}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
              {stat.subtext && <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tác vụ nhanh</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={() => onNavigate('health-records')} size="lg" variant="outline" className="flex items-center justify-center gap-2">
            <Activity className="h-5 w-5" />
            <span>Xem hồ sơ sức khỏe</span>
          </Button>
          <Button onClick={() => onNavigate('donation-history')} size="lg" variant="outline" className="flex items-center justify-center gap-2">
            <History className="h-5 w-5" />
            <span>Lịch sử hiến máu</span>
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Blood Requests Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Yêu Cầu Máu Khẩn Cấp</CardTitle>
        </CardHeader>
        <CardContent>
          {emergencyRequests.length > 0 ? (
            <div className="space-y-3">
              {emergencyRequests.map(req => (
                <div key={req.request_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    {req.emergency_status && <AlertCircle className="h-5 w-5 text-red-500 mr-3"/>}
                    <div>
                      <p className="font-semibold">Cần nhóm máu: {getBloodTypeName(req.blood_id)}</p>
                      <p className="text-sm text-gray-600">Ngày yêu cầu: {format(new Date(req.request_date), 'PPP')}</p>
                      <p className="text-sm text-gray-600">Ngày kết thúc: {format(new Date(req.end_date), 'PPP')}</p>
                      <p className="text-sm text-gray-600">Số lượng cần: {req.donor_count || 'N/A'} người</p>
                  </div>
                  </div>
                  <Button onClick={() => handleDonateNow(req)}>Đóng góp ngay</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Không có yêu cầu máu khẩn cấp nào.</p>
          )}
        </CardContent>
      </Card>

      {isModalOpen && selectedRequest && (
        <MemberDonationRequest
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          eventDate={selectedRequest.request_date}
          requestId={selectedRequest.request_id.toString()}
        />
      )}

      {/* Recent Donations Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lịch hẹn hiến máu gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDonations.length > 0 ? (
            <ul className="space-y-3">
              {recentDonations.map(donation => (
                <li key={donation.donation_id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div>
                    <p className="font-semibold">Ngày: {format(new Date(donation.donation_date), 'PPP')}</p>
                    <p className="text-sm text-gray-500">Ghi chú: {donation.note || 'Không có'}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(donation.status)}>
                    {statusTranslations[donation.status] || donation.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Bạn không có yêu cầu nào đang hoạt động.</p>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
};

export default MemberDashboard;
