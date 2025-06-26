import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import UserManagement from './UserManagement';
import BlogManagement from './BlogManagement';
import AdminDashboard from './AdminDashboard';
import AdminProfile from './AdminProfile';
import { useAuth } from '@/contexts/AuthContext';

const AdminPortal = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, logout } = useAuth();

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
      case 'blog':
        return <BlogManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
      userName={user.displayName || user.email || ""}
    >
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export default AdminPortal; 