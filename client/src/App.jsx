import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/ui/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ReuseMatchingPage from './pages/ReuseMatchingPage';
import RecycleScannerPage from './pages/RecycleScannerPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ChatbotPage from './pages/ChatbotPage';
import AddItemPage from './pages/AddItemPage';
import OSMMap from './components/OSMMap';
import ScanItemPage from './pages/ScanItemPage';

// Create a separate component for the router content
function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-item" element={<AddItemPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reuse"
            element={
              <ProtectedRoute>
                <ReuseMatchingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <ProtectedRoute>
                <RecycleScannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
              <OSMMap/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scan-item"
            element={
              <ProtectedRoute>
                <ScanItemPage />
              </ProtectedRoute>
            }
          />


        </Routes>
      </Layout>
    </Router>
  );
}

// Main App component that provides the auth context
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
