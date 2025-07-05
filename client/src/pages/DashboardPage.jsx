// pages/DashboardPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { PlusCircle, Camera, MapPin, Award, RecycleIcon, LogOut } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUser, markNotificationsAsRead, getUserNotifications } from '../api/apiCalls';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const quickActions = [
    { title: "Add Item", description: "Post a reusable item", icon: <PlusCircle className="text-green-600" size={20} />, onClick: () => navigate('/add-item') },
    { title: "Scan Item", description: "Check recyclability", icon: <Camera className="text-blue-600" size={20} />, onClick: () => navigate('/scan-item') },
    { title: "Find Centers", description: "Locate centers nearby", icon: <MapPin className="text-yellow-600" size={20} />, onClick: () => setShowLocationModal(true) },
    { title: "SwipeCycle", description: "Browse shared items", icon: <RecycleIcon className="text-purple-600" size={20} />, onClick: () => navigate('/swipe') }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;
      try {
        // Fetch user data
        const res = await getUser(currentUser.uid);
        const data = res.data;
        setUserData(data.user);
        setSharedItems(data.user.items || []);
        setAchievements(data.user.achievements || []);
        setUserRank(data.user.rank);

        // ✅ Fetch notifications separately using the dedicated API
        const notifRes = await getUserNotifications(currentUser.uid);
        setNotifications(notifRes.data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Updated function to mark notifications as read and refresh
  const handleMarkAsRead = async () => {
    try {
      await markNotificationsAsRead(currentUser.uid);
      // ✅ Clear notifications from state since they're now read
      setNotifications([]);
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  // Rest of your component remains the same...
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading dashboard...</p></div>;
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center"><p>Unable to load user data.</p></div>;

  return (
    <div className="py-4 md:py-6 space-y-4 md:space-y-6 relative">
      <div className="absolute right-1 top-4 sm:right-2 md:right-4 z-50 flex items-center space-x-1.5 sm:space-x-3" ref={dropdownRef}>
        {/* Notification Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 rounded-full border border-gray-200/50 hover:bg-green-50 hover:border-green-200 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
          aria-label="Notifications"
        >
          {/* Notification dot - only show if there are unread notifications */}
          {notifications.length > 0 && (
            <>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
            </>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z" />
            <path d="M10 18a2 2 0 001.995-1.85L12 16H8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Logout"
          className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 rounded-full border border-gray-200/50 hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
          aria-label="Logout"
        >
          <LogOut className="text-gray-700 group-hover:text-red-600 transition-colors duration-200" size={16} />
        </button>

        {/* Modern Notifications Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 top-12 sm:top-14 md:top-16 w-[calc(100vw-0.5rem)] max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-h-64 sm:max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">You're all caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.slice().reverse().map((notif, index) => (
                    <div
                      key={index}
                      className="p-3 sm:p-4 hover:bg-green-50/50 transition-colors cursor-default bg-blue-50/30"
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(notif.createdAt).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-green-600 hover:text-green-700 font-medium w-full text-center"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rest of your dashboard content remains the same */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Welcome, {currentUser?.displayName?.split(' ')[0] || 'User'} 🌿
        </h1>
        <p className="text-sm md:text-base text-gray-600">Your eco-impact dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <GreenScoreCard score={userData?.points || 0} monthlyChange={150} rank={userRank || '-'} />
        </div>
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <button key={index} onClick={action.onClick} className="flex flex-col lg:flex-row items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200">
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

      {/* Rest of your existing dashboard content... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

      {/* Your existing modals remain the same */}
    </div>
  );
};

export default DashboardPage;
