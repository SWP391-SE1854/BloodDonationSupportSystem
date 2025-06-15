
import React, { useState } from 'react';
import MemberLayout from './MemberLayout';
import MemberDashboard from './MemberDashboard';
import MemberProfile from './MemberProfile';
import MemberDonationRequest from './MemberDonationRequest';
import MemberHealthRecords from './MemberHealthRecords';
import MemberDonationHistory from './MemberDonationHistory';

interface MemberPortalProps {
  user: any;
  onLogout: () => void;
}

const MemberPortal = ({ user, onLogout }: MemberPortalProps) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userData, setUserData] = useState(user);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUserData(updatedUser);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MemberDashboard user={userData} onNavigate={handleNavigate} />;
      case 'profile':
        return <MemberProfile user={userData} onUpdateUser={handleUpdateUser} />;
      case 'donation-request':
        return <MemberDonationRequest />;
      case 'health-records':
        return <MemberHealthRecords />;
      case 'donation-history':
        return <MemberDonationHistory />;
      default:
        return <MemberDashboard user={userData} onNavigate={handleNavigate} />;
    }
  };

  return (
    <MemberLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={onLogout}
      userName={userData.name}
    >
      {renderCurrentPage()}
    </MemberLayout>
  );
};

export default MemberPortal;
