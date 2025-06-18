import React, { useEffect, useState } from 'react';
import { PlusCircle, Camera, MapPin, BarChart2, Award, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  const quickActions = [
    {
      title: "Add Item",
      description: "Post a reusable item for donation",
      icon: <PlusCircle className="text-green-600" size={24} />,
      onClick: () => navigate('/add-item')
    },
    {
      title: "Scan Item",
      description: "Check recyclability of items",
      icon: <Camera className="text-blue-600" size={24} />,
      onClick: () => {
        // Add scan logic here
      }
    },
    {
      title: "Find Centers",
      description: "Locate recycling & donation centers",
      icon: <MapPin className="text-yellow-600" size={24} />,
      onClick: () => setShowLocationModal(true)
    },
    {
      title: "View Stats",
      description: "Track your sustainability journey",
      icon: <BarChart2 className="text-purple-600" size={24} />,
      onClick: () => {
        // Navigate to stats
      }
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Eco Starter",
      description: "Earned 100 Green Points",
      icon: <Award size={20} className="text-green-500" />,
      points: 100
    },
    {
      id: 2,
      title: "Recycler Pro",
      description: "Scanned 25 recyclable items",
      icon: <RefreshCw size={20} className="text-blue-500" />,
      points: 150
    }
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <button onClick={handleSignOut}>Logout Test</button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {currentUser?.displayName || currentUser?.email || 'User'} 🌿
        </h1>
        <p className="text-gray-600">Here's your eco-impact dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <GreenScoreCard
            score={currentUser?.greenScore || 0}
            monthlyChange={150}
            rank={42}
          />
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="w-full flex items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
              >
                <div className="mr-3">{action.icon}</div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          <ul className="space-y-4">
            {achievements.map((achievement) => (
              <li key={achievement.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-700">+{achievement.points} pts</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600">Items Shared</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">38</p>
              <p className="text-sm text-gray-600">Items Scanned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">7</p>
              <p className="text-sm text-gray-600">Matches Made</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Enter your location</h2>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. Ranchi, Jharkhand"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  if (locationInput.trim()) {
                    navigate(`/map?location=${encodeURIComponent(locationInput)}`);
                    setShowLocationModal(false);
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
