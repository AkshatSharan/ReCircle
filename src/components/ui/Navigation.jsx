import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  RefreshCw,
  Camera,
  BarChart3,
  MapPin,
  User
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/reuse', icon: RefreshCw, label: 'Reuse' },
  { path: '/scanner', icon: Camera, label: 'Scan' },
  { path: '/leaderboard', icon: BarChart3, label: 'Stats' },
  { path: '/map', icon: MapPin, label: 'Map' },
  { path: '/profile', icon: User, label: 'Profile' }
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${isActive
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;