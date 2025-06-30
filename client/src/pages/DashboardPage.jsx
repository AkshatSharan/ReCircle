import React, { useEffect, useState } from 'react';
import { PlusCircle, Camera, MapPin, BarChart2, Award, RefreshCw, RecycleIcon,User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();
   const [showChat, setShowChat] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [sharedItems, setSharedItems] = useState([]);

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
       onClick: () => navigate('/scan-item')
    },
    {
      title: "Find Centers",
      description: "Locate recycling & donation centers",
      icon: <MapPin className="text-yellow-600" size={24} />,
      onClick: () => setShowLocationModal(true)
    },
    {
      title: "SwipeCycle",
      description: "Browse community-shared items and match with what you love.",
      icon: <RecycleIcon className="text-purple-600" size={24} />,
      onClick: () => navigate('/swipe')
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

  const [userData, setUserData] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [rankLoading, setRankLoading] = useState(false);
  const [achievements, setAchievements] = useState([]);

useEffect(() => {
  const fetchUserData = async () => {
    if (!currentUser?.uid) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}`);
      const data = await res.json();
      setUserData(data.user);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const fetchUserItems = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}/with-items`);
      const data = await res.json();
      setSharedItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch shared items:", err);
    }
  };

  const fetchUserRank = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}/rank`);
      const data = await res.json();
      setUserRank(data.rank);
    } catch (err) {
      console.error('Failed to fetch user rank:', err);
    } finally {
    }
  };

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}/achievements`);
      const data = await res.json();
      setAchievements(data.achievements);
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
    }
  };

  fetchUserData();
  fetchUserRank();
  fetchAchievements();
  fetchUserItems();
}, [currentUser]);


  return (

    
    <div className="container mx-auto px-4 py-6 max-w-5xl">

<div className="flex justify-end mb-4">

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
</div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {currentUser?.displayName || currentUser?.email || 'User'} 🌿
        </h1>
        <p className="text-gray-600">Here's your eco-impact dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <GreenScoreCard
            score={userData?.points || 0}
            monthlyChange={150}
            rank={userRank || '-'}
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
  {achievements.length === 0 ? (
    <p className="text-sm text-gray-500">No achievements yet. Start contributing to earn some! 🌱</p>
  ) : (
    <>
      <ul className="space-y-4">
        {achievements.slice(0, 2).map((achievement, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Award size={18} className="text-green-500" />
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
        <Button variant="ghost" size="sm" onClick={() => setShowAllAchievements(true)}>
          View All
        </Button>
      </div>
    </>
  )}
</Card>


        <Card>
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h2>
  <div className="grid grid-cols-3 gap-4">
    <div className="text-center">
      <p className="text-2xl font-bold text-green-600">{sharedItems.length}</p> {/* ✅ dynamic count */}
      <p className="text-sm text-gray-600">Items Shared</p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-purple-600">7</p>
      <p className="text-sm text-gray-600">Matches Made</p>
    </div>
  </div>
</Card>

<div className="fixed bottom-6 right-6 z-40">
  <button
    onClick={() => setShowChat(!showChat)}
    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none"
    aria-label="Open Chatbot"
  >
    💬
  </button>
</div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
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

      {/* achievement */}
      {showAllAchievements && (
<div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">All Achievements</h2>
            <button
              className="text-gray-500 hover:text-red-500"
              onClick={() => setShowAllAchievements(false)}
            >
              ✕
            </button>
          </div>
          <ul className="space-y-4">
            {achievements.map((achievement, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Award size={18} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-700">
                  +{achievement.points} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}

    {/* chatbot */}
    {showChat && (
  <div className="fixed bottom-20 right-6 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-slide-in">
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

export default DashboardPage;
