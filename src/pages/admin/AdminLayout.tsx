import React from 'react';
import { User, LogOut, Users, FileText, LayoutDashboard, Droplet, History, HeartPulse, ClipboardList, FlaskConical } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

const AdminLayout = ({ children, currentPage, onNavigate, onLogout, userName }: AdminLayoutProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'blog', label: 'Blog Management', icon: FileText },
    { id: 'donations', label: 'Donations', icon: Droplet },
    { id: 'blood-requests', label: 'Blood Requests', icon: ClipboardList },
    { id: 'history', label: 'Donation History', icon: History },
    { id: 'health-records', label: 'Health Records', icon: HeartPulse },
    { id: 'inventory', label: 'Blood Inventory', icon: FlaskConical },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      <div className="w-64 bg-white shadow-lg border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-500">System Management</p>
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
                    ? 'bg-gray-200 text-gray-800 border border-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
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

export default AdminLayout; 