import React, { useState } from 'react';
import StaffLayout from './StaffLayout';
import StaffDashboard from './StaffDashboard';
import StaffProfile from './StaffProfile';
import UserManagement from '@/pages/admin/UserManagement'; // Assuming staff can also manage users
import BlogManagement from '@/pages/admin/BlogManagement';   // Assuming staff can also manage blogs
import StaffBloodRequest from './StaffBloodRequest'; // Import the new component
import { useAuth } from '@/contexts/AuthContext';

const StaffPortal = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, logout } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <StaffDashboard />;
      case 'profile':
        return <StaffProfile />;
      case 'users':
        return <UserManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'blood-requests':
        return <StaffBloodRequest />;
      // Add other staff pages here
      default:
        return <StaffDashboard />;
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or a redirect to login
  }

  return (
    <StaffLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
      userName={user.displayName || user.email}
    >
      {renderCurrentPage()}
    </StaffLayout>
  );
};

export default StaffPortal; 