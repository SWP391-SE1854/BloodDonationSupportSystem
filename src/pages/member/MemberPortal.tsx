import React, { useState } from 'react';
import MemberLayout from './MemberLayout';
import MemberDashboard from './MemberDashboard';
import MemberProfile from './MemberProfile';
import MemberDonationRequest from './MemberDonationRequest';
import MemberHealthRecords from './MemberHealthRecords';
import MemberDonationHistory from './MemberDonationHistory';
import { useAuth } from '@/contexts/AuthContext';

const MemberPortal = () => {
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
        return <MemberDashboard user={user} onNavigate={handleNavigate} />;
      case 'profile':
        return <MemberProfile user={user} onUpdateUser={() => {}} />; // onUpdateUser might need to be refactored
      case 'donation-request':
        return <MemberDonationRequest />;
      case 'health-records':
        return <MemberHealthRecords />;
      case 'donation-history':
        return <MemberDonationHistory />;
      default:
        return <MemberDashboard user={user} onNavigate={handleNavigate} />;
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or a redirect to login
  }

  return (
    <MemberLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
      userName={user.displayName || user.email}
    >
      {renderCurrentPage()}
    </MemberLayout>
  );
};

export default MemberPortal;
