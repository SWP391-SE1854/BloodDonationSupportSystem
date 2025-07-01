import React, { useState, useEffect } from 'react';
import ProfileLayout from './ProfileLayout';
import ProfilePage from './ProfilePage';
import EditProfileForm from '@/components/EditProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api.service';
import { API_ENDPOINTS } from '@/services/api.config';
import { useUserRole } from '@/hooks/useUserRole';

const ProfilePortal = () => {
  const [currentPage, setCurrentPage] = useState('profile');
  const { user, logout } = useAuth();
  const role = useUserRole();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async () => {
    if (user && role) {
      try {
        let endpoint = '';
        if (role === 'Member') {
          endpoint = API_ENDPOINTS.USER.GET_MEMBER_PROFILE;
        } else if (role === 'Staff' || role === 'Admin') {
          endpoint = API_ENDPOINTS.USER.GET_STAFF_PROFILE;
        }

        if (endpoint) {
          const response = await api.get(endpoint);
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user, role]);

  const handleNavigate = (page: string) => {
    if (page === 'edit-profile') {
      setEditModalOpen(true);
    } else {
      setCurrentPage(page);
    }
  };

  const handleProfileUpdated = () => {
    fetchProfileData();
  };
  
  const renderCurrentPage = () => {
    if (!user || !profileData) {
      return <div>Loading user data...</div>;
    }

    switch (currentPage) {
      case 'profile':
        return <ProfilePage />;
      default:
        return <ProfilePage />;
    }
  };

  if (!user || !profileData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
      userName={user.displayName || user.email || ''}
    >
      {renderCurrentPage()}
      <EditProfileForm
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        profileData={profileData}
        onProfileUpdated={handleProfileUpdated}
      />
    </ProfileLayout>
  );
};

export default ProfilePortal; 