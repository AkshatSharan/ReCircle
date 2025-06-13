import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ReuseMatchingPage from './pages/ReuseMatchingPage';
import RecycleScannerPage from './pages/RecycleScannerPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MapPage from './pages/MapPage';
import ChatbotPage from './pages/ChatbotPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reuse" element={<ReuseMatchingPage />} />
          <Route path="/scanner" element={<RecycleScannerPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;