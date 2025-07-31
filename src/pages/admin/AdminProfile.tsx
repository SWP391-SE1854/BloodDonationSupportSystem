import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hồ sơ Admin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Tên hiển thị:</strong> {user?.displayName || 'Chưa đặt'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile; 