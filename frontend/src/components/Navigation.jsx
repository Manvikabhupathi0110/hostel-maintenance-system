import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, Home, FileText, Calendar, Users, BarChart2, User } from 'lucide-react';

const navConfig = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: Home },
    { label: 'My Complaints', path: '/complaints', icon: FileText },
    { label: 'My Slots', path: '/my-slots', icon: Calendar },
  ],
  electrician: [
    { label: 'Dashboard', path: '/electrician/dashboard', icon: Home },
    { label: 'Assignments', path: '/assignments', icon: Calendar },
    { label: 'Profile', path: '/electrician-profile', icon: User },
  ],
  warden: [
    { label: 'Dashboard', path: '/warden/dashboard', icon: Home },
    { label: 'All Complaints', path: '/warden/complaints', icon: FileText },
    { label: 'Electricians', path: '/warden/electricians', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  ],
  admin: [
    { label: 'Dashboard', path: '/warden/dashboard', icon: Home },
    { label: 'All Complaints', path: '/warden/complaints', icon: FileText },
    { label: 'Electricians', path: '/warden/electricians', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  ],
};

export default function Navigation() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const links = navConfig[user?.role] || [];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="font-bold text-xl text-blue-600">
              🏢 Hostel Maintenance
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:block text-sm text-gray-600">
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}