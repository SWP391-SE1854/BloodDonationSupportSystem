import React, { useState } from 'react';
import StaffLayout from "./StaffLayout";
import StaffDashboard from "./StaffDashboard";
import StaffProfile from "./StaffProfile";
import BlogManagement from "@/pages/admin/BlogManagement";
import { useAuth } from "@/contexts/AuthContext";
import StaffDonationManagement from "./StaffDonationManagement";
import BloodRequestManagement from './BloodRequestManagement';
import DonationHistoryViewer from '../admin/DonationHistoryViewer';
import HealthRecordViewer from '../admin/HealthRecordViewer';
import BloodInventoryManagement from './BloodInventoryManagement';

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
      case 'requests':
        return <BloodRequestManagement />;
      case 'history':
        return <DonationHistoryViewer />;
      case 'health-records':
        return <HealthRecordViewer />;
      case 'inventory':
        return <BloodInventoryManagement />;
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
