import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';
import UserManagement from './UserManagement';
import AdminDashboard from './AdminDashboard';
import AdminProfile from './AdminProfile';

const AdminPortal = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { logout, user } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'profile':
        return <AdminProfile />;
      case 'users':
        return <UserManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
      userName={user?.displayName || user?.email || "Admin"}
    >
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export default AdminPortal; 