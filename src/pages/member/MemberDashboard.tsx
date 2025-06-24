import React, { useState, useEffect } from 'react';
import { Heart, Calendar, FileText, Activity, Bell, Droplet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/user.service';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import { DonationHistoryService, DonationHistoryRecord } from '@/services/donation-history.service';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays } from 'date-fns';

const bloodTypes = [
    { id: "1", name: "A+" }, { id: "2", name: "A-" }, { id: "3", name: "B+" },
    { id: "4", name: "B-" }, { id: "5", name: "AB+" }, { id: "6", name: "AB-" },
    { id: "7", name: "O+" }, { id: "8", name: "O-" }
];

const getBloodTypeName = (id: string | number) => {
    const bloodType = bloodTypes.find(bt => bt.id === id.toString());
    return bloodType ? bloodType.name : 'N/A';
};

type HistoryServerResponse = DonationHistoryRecord[] | { $values: DonationHistoryRecord[] };

interface MemberDashboardProps {
  onNavigate: (page: string) => void;
}

const MemberDashboard = ({ onNavigate }: MemberDashboardProps) => {
  const { user } = useAuth();
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [history, setHistory] = useState<DonationHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await DonationHistoryService.getMemberHistory() as HistoryServerResponse;
        if (historyData && '$values' in historyData) {
          setHistory(Array.isArray(historyData.$values) ? historyData.$values : []);
        } else if (Array.isArray(historyData)) {
          setHistory(historyData);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const nextEligibleDays = healthRecord?.last_donation ? 90 - differenceInDays(new Date(), new Date(healthRecord.last_donation)) : 0;

  const memberStats = [
    { title: 'Total Donations', value: healthRecord?.donation_count ?? 'N/A', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100' },
    { title: 'Blood Type', value: healthRecord ? getBloodTypeName(healthRecord.blood_type) : 'N/A', icon: Droplet, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Next Eligible', value: nextEligibleDays > 0 ? `${nextEligibleDays} days` : 'Now', icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Notifications', value: '3', icon: Bell, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const recentDonations = history.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.displayName ?? 'Member'}!</h1>
            <p className="text-red-100 text-lg">Thank you for being a life-saving donor</p>
          </div>
          <Heart className="h-16 w-16 text-red-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          memberStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-red-100 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-red-100 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="font-semibold">Create Donation Request</span>
            </div>
            <p className="text-sm text-gray-600">Schedule your next blood donation</p>
          </div>
          <button 
            onClick={() => onNavigate('donation-request')}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Request Donation
          </button>
        </div>

        <div className="bg-white border border-green-100 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Health Records</span>
            </div>
            <p className="text-sm text-gray-600">View your health information</p>
          </div>
          <button 
            onClick={() => onNavigate('health-records')}
            className="w-full border border-green-200 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
          >
            View Records
          </button>
        </div>

        <div className="bg-white border border-blue-100 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Donation History</span>
            </div>
            <p className="text-sm text-gray-600">Track your donations</p>
          </div>
          <button 
            onClick={() => onNavigate('donation-history')}
            className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            View History
          </button>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white border border-red-100 rounded-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span className="font-semibold">Recent Donations</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Your latest donation activities</p>
        </div>
        <div className="p-6">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
          <div className="space-y-4">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
              <div key={donation.donation_id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                        <p className="font-medium text-gray-900">{`Donation #${donation.donation_id}`}</p>
                    <p className="text-sm text-gray-500">{donation.location}</p>
                        <p className="text-xs text-gray-400">{format(new Date(donation.donation_date), 'PPP')}</p>
                  </div>
                </div>
                <div className="text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm capitalize">
                    {donation.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{donation.quantity}ml</p>
                </div>
              </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No recent donations found.</p>
              )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
