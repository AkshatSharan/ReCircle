// pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { PlusCircle, Camera, MapPin, BarChart2, Award, RefreshCw, RecycleIcon, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api/apiCalls';

const DashboardPage = () => {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [sharedItems, setSharedItems] = useState([]);

  const quickActions = [
    {
      title: "Add Item",
      description: "Post a reusable item",
      icon: <PlusCircle className="text-green-600" size={20} />,
      onClick: () => navigate('/add-item')
    },
    {
      title: "Scan Item",
      description: "Check recyclability",
      icon: <Camera className="text-blue-600" size={20} />,
      onClick: () => navigate('/scan-item')
    },
    {
      title: "Find Centers",
      description: "Locate centers nearby",
      icon: <MapPin className="text-yellow-600" size={20} />,
      onClick: () => setShowLocationModal(true)
    },
    {
      title: "SwipeCycle",
      description: "Browse shared items",
      icon: <RecycleIcon className="text-purple-600" size={20} />,
      onClick: () => navigate('/swipe')
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        const res = await getUser(currentUser.uid);
        const data = res.data;
        setUserData(data.user);
        setSharedItems(data.user.items || []);
        setAchievements(data.user.achievements || []);
        setUserRank(data.user.rank);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-sm">Unable to load user data.</p>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-6 space-y-4 md:space-y-6">
      {/* Header - Mobile optimized */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Welcome, {currentUser?.displayName?.split(' ')[0] || 'User'} 🌿
        </h1>
        <p className="text-sm md:text-base text-gray-600">Your eco-impact dashboard</p>
      </div>

      {/* Main Grid - Mobile-first responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Green Score Card - Full width on mobile */}
        <div className="lg:col-span-2">
          <GreenScoreCard
            score={userData?.points || 0}
            monthlyChange={150}
            rank={userRank || '-'}
          />
        </div>

        {/* Quick Actions - Stacked on mobile */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col lg:flex-row items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200 text-center lg:text-left"
              >
                <div className="mb-2 lg:mb-0 lg:mr-3">{action.icon}</div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-600 hidden lg:block">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid - Mobile-first responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Achievements */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          {achievements.length === 0 ? (
            <p className="text-sm text-gray-500">No achievements yet. Start contributing! 🌱</p>
          ) : (
            <>
              <ul className="space-y-3">
                {achievements.slice(0, 2).map((achievement, index) => (
                  <li key={index} className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                        <Award size={16} className="text-green-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{achievement.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{achievement.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-700 ml-2">+{achievement.points}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <Button variant="ghost" size="sm" onClick={() => setShowAllAchievements(true)}>
                  View All
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Activity Stats */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{sharedItems.length}</p>
              <p className="text-sm text-gray-600">Items Shared</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">7</p>
              <p className="text-sm text-gray-600">Matches Made</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Location Modal - Mobile optimized */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Enter your location</h2>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. Ranchi, Jharkhand"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

      {/* Achievements Modal - Mobile optimized */}
      {showAllAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">All Achievements</h2>
              <button
                className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center"
                onClick={() => setShowAllAchievements(false)}
              >
                ✕
              </button>
            </div>
            <ul className="space-y-4">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <Award size={16} className="text-green-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-700 ml-2">
                    +{achievement.points} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
