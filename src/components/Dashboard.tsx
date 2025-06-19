import React from 'react';
import { Heart, Calendar, FileText, Activity, TrendingUp, Users, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  name: string;
}

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  const stats = [
    {
      title: 'Total Donations',
      value: '5',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Lives Saved',
      value: '15',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Next Eligible',
      value: '45 days',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Health Score',
      value: '98%',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'donation',
      title: 'Blood Donation Completed',
      description: 'Donated 450ml at City Medical Center',
      date: '2025-05-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'request',
      title: 'Donation Request Submitted',
      description: 'Request for next donation appointment',
      date: '2025-05-10',
      status: 'pending',
    },
    {
      id: 3,
      type: 'health',
      title: 'Health Record Updated',
      description: 'Annual health checkup completed',
      date: '2025-05-01',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-red-100 text-lg">Thank you for being a life-saving hero</p>
          </div>
          <Heart className="h-16 w-16 text-red-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover border-red-100">
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
        <Card className="card-hover border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Make a Donation</span>
            </CardTitle>
            <CardDescription>Schedule your next blood donation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('donation-request')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Create Donation Request
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Health Records</span>
            </CardTitle>
            <CardDescription>View and update your health information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('health-records')}
              variant="outline"
              className="w-full border-green-200 text-green-600 hover:bg-green-50"
            >
              View Health Records
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Donation History</span>
            </CardTitle>
            <CardDescription>Review your donation history</CardDescription>
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

      {/* Recent Activity */}
      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Your latest donations and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'donation' ? 'bg-red-100' :
                    activity.type === 'request' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'donation' && <Heart className="h-4 w-4 text-red-600" />}
                    {activity.type === 'request' && <Calendar className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'health' && <Activity className="h-4 w-4 text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
