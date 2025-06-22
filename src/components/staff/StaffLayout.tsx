import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, LogOut, Users, Newspaper, Droplet } from 'lucide-react';

interface StaffLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
}

const StaffLayout = ({ children, onLogout, userName }: StaffLayoutProps) => {
  const location = useLocation();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/staff/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/staff/profile' },
    { id: 'blog', label: 'Blog Posts', icon: Newspaper, path: '/staff/blog' },
    { id: 'donations', label: 'Donations', icon: Droplet, path: '/staff/donations' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Blood Donation</h1>
              <p className="text-sm text-gray-500">Staff Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.id === 'dashboard' && location.pathname === '/staff');
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info and logout at bottom */}
        <div className="p-4 border-t border-gray-200">
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