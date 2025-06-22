import React, { useState } from 'react';
import StaffLayout from "./StaffLayout";
import StaffDashboard from "./StaffDashboard";
import StaffProfile from "./StaffProfile";
import BlogManagement from "@/pages/admin/BlogManagement";
import { useAuth } from "@/contexts/AuthContext";
import StaffDonationManagement from "./StaffDonationManagement";

const StaffPortal = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, logout } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    if (!user) {
      return <div>Loading user data...</div>;
    }

    switch (currentPage) {
      case 'dashboard':
        return <StaffDashboard />;
      case 'profile':
        return <StaffProfile />;
      case 'blog':
        return <BlogManagement />;
      case 'donations':
        return <StaffDonationManagement />;
      default:
        return <StaffDashboard />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <StaffLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
      userName={user.displayName || user.email || ""}
    >
      {renderCurrentPage()}
    </StaffLayout>
  );
};

export default StaffPortal; 
