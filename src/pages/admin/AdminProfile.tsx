import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile; 