
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AuthForm from '@/components/AuthForm';
import MemberDashboard from '@/components/MemberDashboard';
import MemberProfile from '@/components/MemberProfile';
import MemberDonationRequest from '@/components/MemberDonationRequest';
import MemberHealthRecords from '@/components/MemberHealthRecords';
import MemberDonationHistory from '@/components/MemberDonationHistory';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleUpdateUser = (userData: any) => {
    setUser(userData);
  };

  const renderCurrentPage = () => {
    if (!user) return <AuthForm onLogin={handleLogin} />;

    switch (currentPage) {
      case 'dashboard':
        return <MemberDashboard user={user} onNavigate={handleNavigate} />;
      case 'profile':
        return <MemberProfile user={user} onUpdateUser={handleUpdateUser} />;
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

  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isAuthenticated={!!user}
      >
        {renderCurrentPage()}
      </Layout>
      <Toaster />
    </>
  );
};

export default Index;
