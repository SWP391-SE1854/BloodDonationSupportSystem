
import React from 'react';
import { Heart, Calendar, FileText, Activity, Users, MapPin, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MemberDashboardProps {
  user: any;
  onNavigate: (page: string) => void;
}

const MemberDashboard = ({ user, onNavigate }: MemberDashboardProps) => {
  const memberStats = [
    {
      title: 'Total Donations',
      value: '5',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Blood Type',
      value: 'O+',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Next Eligible',
      value: '45 days',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Notifications',
      value: '3',
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentDonations = [
    {
      donation_id: 'DON-2025-001',
      donation_date: '2025-05-15',
      location: 'City Medical Center',
      component: 'Whole Blood',
      quantity: 450,
      status: 'completed'
    },
    {
      donation_id: 'DON-2025-002',
      donation_date: '2025-03-10',
      location: 'Community Health Center',
      component: 'Platelets',
      quantity: 300,
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
            <p className="text-red-100 text-lg">Thank you for being a life-saving donor</p>
          </div>
          <Heart className="h-16 w-16 text-red-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {memberStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-red-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-100 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Create Donation Request</span>
            </CardTitle>
            <CardDescription>Schedule your next blood donation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('donation-request')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Request Donation
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Health Records</span>
            </CardTitle>
            <CardDescription>View your health information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('health-records')}
              variant="outline"
              className="w-full border-green-200 text-green-600 hover:bg-green-50"
            >
              View Records
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Donation History</span>
            </CardTitle>
            <CardDescription>Track your donations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('donation-history')}
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>Recent Donations</span>
          </CardTitle>
          <CardDescription>Your latest donation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div key={donation.donation_id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donation.donation_id}</p>
                    <p className="text-sm text-gray-500">{donation.location}</p>
                    <p className="text-xs text-gray-400">{donation.donation_date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800">
                    {donation.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{donation.quantity}ml</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
