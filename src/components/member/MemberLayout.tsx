
import React from 'react';
import { Heart, User, LogOut, Home, Calendar, FileText, Activity } from 'lucide-react';

interface MemberLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

const MemberLayout = ({ children, currentPage, onNavigate, onLogout, userName }: MemberLayoutProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'donation-request', label: 'Donate', icon: Heart },
    { id: 'health-records', label: 'Health Records', icon: Activity },
    { id: 'donation-history', label: 'History', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-red-100">
        <div className="p-6 border-b border-red-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Blood Donation</h1>
              <p className="text-sm text-gray-500">Member Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-center mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="font-semibold text-red-700">{userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default MemberLayout;
