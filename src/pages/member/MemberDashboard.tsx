import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Calendar, FileText, Activity, Droplet, Bell, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import { DonationHistoryService, DonationHistoryRecord } from '@/services/donation-history.service';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';
import { calculateNextEligibleDate, DonationHistoryEntry, getWaitingPeriod, getLatestDonation } from '@/utils/donationConstants';
import { isEligibleByHistory } from '@/utils/donationConstants';
import NotificationBell, { Notification } from '@/components/ui/NotificationBell';
import NotificationService from '@/services/notification.service';
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


const bloodTypes = [
    { id: "1", name: "A+" }, { id: "2", name: "A-" }, { id: "3", name: "B+" },
    { id: "4", name: "B-" }, { id: "5", name: "AB+" }, { id: "6", "name": "AB-" },
    { id: "7", name: "O+" }, { id: "8", name: "O-" }
];

const getBloodTypeName = (id: string | number | null): string => {
    if (id === null) return 'N/A';
    const stringId = id.toString();
    const bloodType = bloodTypes.find(bt => bt.id === stringId);
    return bloodType ? bloodType.name : 'N/A';
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
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const navigate = useNavigate();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const { toast } = useToast();

  // Calculate total completed donations
  const totalDonations = useMemo(() => {
    return history.filter(donation => donation.status.toLowerCase() === 'completed').length;
  }, [history]);

  // Calculate eligibility and waiting period
  const { isEligible, lastDonation, waitingPeriod, nextEligibleDate } = useMemo(() => {
    const nextDate = calculateNextEligibleDate(history as DonationHistoryEntry[]);
    const latestDonation = getLatestDonation(history as DonationHistoryEntry[]);
    const componentWaitingPeriod = latestDonation ? getWaitingPeriod(latestDonation.component) : 0;

    return {
      isEligible: isEligibleByHistory(history as DonationHistoryEntry[]),
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

        const [historyData, recordData] = await Promise.all([historyPromise, healthRecordPromise]);

        if (historyData && '$values' in historyData) {
          setHistory(Array.isArray(historyData.$values) ? historyData.$values : []);
        } else if (Array.isArray(historyData)) {
          setHistory(historyData);
        } else {
          setHistory([]);
        }

        if (recordData) {
          setHealthRecord(recordData);
        }

        // Filter and sort blood requests
        const activeRequests = Array.isArray(requestsData) 
          ? requestsData 
          : (requestsData as BloodRequestServerResponse).$values || [];

        setBloodRequests(activeRequests.sort((a, b) => {
          if (a.emergency_status && !b.emergency_status) return -1;
          if (!a.emergency_status && b.emergency_status) return 1;
          return new Date(b.request_date).getTime() - new Date(a.request_date).getTime();
        }));

        // Filter and sort recent donations
        const sortedDonations = donationsData
          .filter(d => d.status === 'Pending' || d.status === 'Approved')
          .sort((a, b) => new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime())
          .slice(0, 5);
        setRecentDonations(sortedDonations);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    // For development, using mock data
    const mockNotifications = NotificationService.getMockNotifications();
    setNotifications(mockNotifications);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Handle notification click based on type
    switch (notification.type) {
      case 'event':
        onNavigate('donation-request');
        break;
      case 'request':
        onNavigate('donation-request');
        break;
      case 'system':
        onNavigate('health-records');
        break;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

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
      title: 'Tổng Số Lần Hiến', 
      value: totalDonations, 
      icon: Heart, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100' 
    },
    { 
      title: 'Nhóm Máu', 
      value: healthRecord ? getBloodTypeName(healthRecord.blood_type) : 'N/A', 
      icon: Droplet, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100' 
    },
    { 
      title: 'Lần Hiến Tiếp Theo', 
      value: isEligible ? 'Ngay bây giờ' : `${waitingPeriod} ngày`, 
      description: lastDonation 
        ? `Lần hiến gần nhất (${lastDonation.component}): ${format(new Date(lastDonation.donation_date), 'PPP')}` 
        : 'Chưa có lần hiến nào',
      subtext: !isEligible ? `Đủ điều kiện vào: ${nextEligibleDate}` : 'Bạn đủ điều kiện hiến máu',
      icon: Calendar, 
      color: isEligible ? 'text-green-600' : 'text-red-600', 
      bgColor: isEligible ? 'bg-green-100' : 'bg-red-100' 
    }
  ];

  const handleScheduleDonation = () => {
    navigate('/member/donation-request');
  };

  const handleViewAllRequests = () => {
    navigate('/member/blood-requests');
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
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <AlertCircle className="mr-2 h-4 w-4" /> Báo cáo sự cố
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Báo cáo sự cố</DialogTitle>
                  <DialogDescription>
                    Gặp sự cố? Gửi báo cáo cho quản trị viên của chúng tôi. Chúng tôi sẽ xem xét sớm nhất có thể.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Tiêu đề
                    </Label>
                    <Input id="title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="message" className="text-right">
                      Nội dung
                    </Label>
                    <Textarea id="message" value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleReportProblem}>Gửi báo cáo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <NotificationBell
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />
            <Heart className="h-16 w-16 text-red-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          memberStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-red-100 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    {stat.description && (
                      <p className="text-sm text-red-500 mt-1">{stat.description}</p>
                    )}
                    {stat.subtext && (
                      <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
          })
        )}
      </div>

      {/* Blood Requests Section */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Yêu Cầu Máu Khẩn Cấp</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Các yêu cầu máu khẩn cấp trong khu vực của bạn. Sự giúp đỡ của bạn là rất cần thiết!</p>
          </div>
          <Button onClick={handleScheduleDonation}>
            <Calendar className="mr-2 h-4 w-4" />
            Đặt Lịch Hiến Máu
          </Button>
        </CardHeader>
        <CardContent>
          {bloodRequests.length > 0 ? (
            <div className="space-y-3">
              {bloodRequests.slice(0, 3).map(req => (
                <div key={req.request_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    {req.emergency_status && <AlertCircle className="h-5 w-5 text-red-500 mr-3"/>}
                    <div>
                      <p className="font-semibold">Cần nhóm máu: {getBloodTypeName(req.blood_id)}</p>
                      <p className="text-sm text-gray-600">Ngày yêu cầu: {format(new Date(req.request_date), 'PPP')}</p>
                  </div>
                  </div>
                  <Button variant="link" size="sm" onClick={() => navigate(`/requests/${req.request_id}`)}>Chi tiết</Button>
                </div>
              ))}
              {bloodRequests.length > 3 && (
                <Button variant="secondary" className="w-full mt-2" onClick={handleViewAllRequests}>
                  Xem Tất Cả Yêu Cầu
                </Button>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Không có yêu cầu máu khẩn cấp nào.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Donations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lịch Hẹn Gần Đây</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Các lịch hẹn hiến máu sắp tới và gần đây của bạn.</p>
        </CardHeader>
        <CardContent>
          {recentDonations.length > 0 ? (
            <div className="space-y-3">
              {recentDonations.map(donation => (
                <div key={donation.donation_id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-semibold">Ngày hiến: {format(new Date(donation.donation_date), 'PPP p')}</p>
                      <Badge variant={donation.status === 'Approved' ? 'default' : 'secondary'}>{donation.status}</Badge>
                  </div>
                  </div>
                  <Button variant="link" size="sm" onClick={() => navigate(`/donations/${donation.donation_id}`)}>Chi tiết</Button>
                </div>
              ))}
          </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Không có lịch hẹn hiến máu nào gần đây.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
