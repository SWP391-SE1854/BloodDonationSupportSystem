import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Newspaper, Droplet } from 'lucide-react';

const StaffDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage user accounts.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-6 w-6" /> Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Create, edit, and publish blog articles.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-6 w-6" /> Donation Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage incoming donation requests.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard; 