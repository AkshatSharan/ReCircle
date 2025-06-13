import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`${!isHomePage ? 'pb-20 md:pb-0' : ''}`}>
        {children}
      </main>
      {!isHomePage && <Navigation />}
    </div>
  );
};

export default Layout;