import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // adjust path as needed
import Navigation from './Navigation';
import { User } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
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
      {/* Fixed top-right buttons (Home, Profile, Logout) */}
      {!isHomePage && (
        <div className="fixed top-4 right-4 z-50 flex space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="cursor-pointer px-4 py-2 bg-gray-800 text-white font-medium rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="cursor-pointer px-4 py-2 bg-blue-700 text-white font-medium rounded-lg shadow hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={handleSignOut}
            className="cursor-pointer px-4 py-2 bg-green-900 text-white font-medium rounded-lg shadow hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      {/* Page content */}
      <main className={`${!isHomePage ? 'pb-20 md:pb-0' : ''}`}>
        {children}
      </main>

      {/* Navigation bar */}
      {!isHomePage && <Navigation />}

      {/* Chatbot toggle button */}
      {!isHomePage && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
            aria-label="Open Chatbot"
          >
            💬
          </button>
        </div>
      )}

      {/* Chatbot modal */}
      {showChat && !isHomePage && (
        <div className="fixed bottom-20 right-6 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between">
            <span className="font-semibold">EcoBot</span>
            <button
              onClick={() => setShowChat(false)}
              className="text-white text-sm hover:text-red-300"
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
