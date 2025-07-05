import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const [showChat, setShowChat] = useState(false);
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - only show when not on home, login, or register */}
      {!isHomePage && !isLoginPage && !isRegisterPage && <Navigation />}

      {/* Page content with proper spacing - special handling for map */}
      <main className={`${!isHomePage && !isLoginPage && !isRegisterPage
          ? location.pathname === '/map'
            ? 'pb-20 md:pb-0 md:ml-20'
            : 'pb-20 md:pb-6 md:ml-20 px-4 md:px-6'
          : 'px-4 md:px-6'
        }`}>
        {/* Container wrapper - only for non-map pages */}
        {location.pathname === '/map' ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        )}
      </main>

      {/* Chatbot modal - responsive */}
      {showChat && !isHomePage && !isLoginPage && !isRegisterPage && (
        <div className="fixed bottom-28 right-4 md:bottom-20 md:right-6 w-[calc(100vw-2rem)] max-w-[350px] h-[60vh] max-h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">EcoBot</span>
            <button
              onClick={() => setShowChat(false)}
              className="text-white text-lg hover:text-red-300 w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          <iframe
            src="/chat"
            title="Chatbot"
            className="w-full h-full border-none"
          />
        </div>
      )}
    </div>
  );
};

export default Layout;
