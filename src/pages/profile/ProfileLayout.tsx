import React from 'react';
import { User, LogOut, Edit } from 'lucide-react';

interface ProfileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

const ProfileLayout = ({ children, currentPage, onNavigate, onLogout, userName }: ProfileLayoutProps) => {
  const menuItems = [
    { id: 'profile', label: 'View Profile', icon: User },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">
      <div className="w-64 bg-white shadow-lg border-r border-blue-100 flex flex-col">
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Your Profile</h1>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-100">
          <div className="text-center mb-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-medium text-gray-700 truncate">{userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout; 