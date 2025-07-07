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
      description: lastDonation ? `Lần hiến gần nhất (${lastDonation.component}): ${format(new Date(lastDonation.donation_date), 'PPP')}` : undefined,
      subtext: !isEligible ? `Đủ điều kiện vào: ${nextEligibleDate}` : undefined,
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
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section with Notification Bell */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Xin chào, {user?.displayName ?? 'Thành viên'}!</h1>
            <p className="text-red-100 text-lg">Cảm ơn bạn đã tham gia hiến máu cứu người</p>
          </div>
          <div className="flex items-center space-x-4">
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Blood Requests</CardTitle>
          <Button variant="outline" onClick={handleViewAllRequests}>View All</Button>
        </CardHeader>
        <CardContent>
          {bloodRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No active blood requests</div>
          ) : (
            <div className="space-y-4">
              {bloodRequests.slice(0, 5).map((request) => (
                <Card key={request.request_id} className={request.emergency_status ? 'border-red-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Heart className={`h-5 w-5 ${request.emergency_status ? 'text-red-500' : 'text-gray-500'}`} />
                          <span className="font-medium">Blood Type: {request.blood_id}</span>
                          {request.emergency_status && (
                            <Badge variant="destructive">Emergency</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(request.request_date), 'PPP')}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleScheduleDonation}>Schedule Donation</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Donations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDonations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No recent donations</div>
          ) : (
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <Card key={donation.donation_id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">
                            {format(new Date(donation.donation_date), 'PPP')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{donation.donation_time}</span>
                          </div>
                          <Badge variant={
                            donation.status === 'Approved' ? 'secondary' :
                            donation.status === 'Pending' ? 'outline' : 'default'
                          }>
                            {donation.status}
                          </Badge>
                        </div>
                        {donation.note && (
                          <p className="text-sm text-gray-600 mt-2">{donation.note}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
