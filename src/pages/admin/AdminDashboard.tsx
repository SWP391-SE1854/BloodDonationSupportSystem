import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Here you can manage the entire system. Use the sidebar to navigate to different sections.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 