import React from 'react';
import { HeartPulse, User, LogOut, Home, Droplets, Newspaper, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StaffLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

const StaffLayout = ({ children, currentPage, onNavigate, onLogout, userName }: StaffLayoutProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/staff/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/staff/profile' },
    { id: 'blog', label: 'Blog Posts', icon: Newspaper, path: '/staff/blog' },
    { id: 'donations', label: 'Donations', icon: Droplet, path: '/staff/donations' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-purple-100 flex flex-col">
        <div className="p-6 border-b border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HeartPulse className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Blood Donation</h1>
              <p className="text-sm text-gray-500">Staff Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <Link to="/blood-request" className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100`}>
            <HeartPulse className="h-5 w-5" />
            <span className="font-medium">Blood Requests</span>
          </Link>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const buttonClass = `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={buttonClass}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User info and logout at bottom */}
        <div className="p-4 border-t border-purple-100">
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default StaffLayout; 