// components/ui/Navigation.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  Camera,
  MessageCircle,
  Plus,
  User,
  MapPin,
  Scan
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/swipe', icon: Heart, label: 'Swipe' },
  { path: '/add-item', icon: Plus, label: 'Add' },
  { path: '/scan-item', icon: Scan, label: 'Scan' },
  { path: '/map', icon: MapPin, label: 'Map' },
  { path: '/profile', icon: User, label: 'Profile' }
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Show/hide chat button only on mobile
  const isChatPage = location.pathname === '/chat';

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="relative w-full bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
          <div className="flex justify-between items-center px-1 py-1 max-w-full overflow-x-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex-1 min-w-0 flex flex-col items-center py-1 px-1 mx-0.5 rounded-lg transition-all duration-200 ${isActive
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  style={{ flexBasis: '0', flexGrow: 1, maxWidth: '64px' }}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow'
                      : 'bg-gray-100'
                      }`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className={`text-[11px] mt-0.5 truncate w-full text-center leading-tight ${isActive ? 'font-semibold' : ''}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Floating Chat Button */}
        {!isChatPage && (
          <button
            onClick={() => navigate('/chat')}
            className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center transition-all"
            aria-label="Open Chat"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
          >
            <MessageCircle size={20} />
          </button>
        )}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-white/95 backdrop-blur-xl border-r border-gray-200/30 shadow-xl z-50 flex-col items-center py-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">R</span>
          </div>
        </div>
        {/* Navigation Items */}
        <div className="flex flex-col space-y-4">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`relative group p-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30'
                  : 'hover:bg-gray-100'
                  }`}
                title={label}
              >
                <Icon
                  size={24}
                  className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                    }`}
                />
                {/* Tooltip */}
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-green-500 rounded-r" />
                )}
              </Link>
            );
          })}
        </div>
        {/* Desktop Chat Shortcut at bottom */}
        <div className="mt-auto">
          <Link
            to="/chat"
            className={`p-3 rounded-xl transition-all duration-300 ${location.pathname === '/chat'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
              : 'hover:bg-gray-100'
              }`}
            title="Chat"
          >
            <MessageCircle
              size={24}
              className={`transition-all duration-300 ${location.pathname === '/chat' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
            />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navigation;