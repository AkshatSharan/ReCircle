import React, { useEffect, useState } from 'react';
import {
  Mail, MapPin, Calendar, Award, Settings, Camera,
  Edit3, Save, X, User, AtSign, Globe
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUser, getUserAchievements, updateUserProfile, uploadUserAvatar } from '../api/apiCalls';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUser(currentUser.uid);
        const data = res.data;
        setUserData(data.user);
        setProfileData({
          name: data.user.name,
          email: data.user.email,
          bio: data.user.bio || '',
        });
        setAchievements(data.user.achievements || []);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    if (currentUser?.uid) {
      fetchProfile();
    }
  }, [currentUser]);

  // Cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    try {
      const currentRank = userData.rank;

      // Update profile data
      const res = await updateUserProfile(currentUser.uid, profileData);
      setUserData({ ...res.data.user, rank: currentRank });

      // Handle avatar upload if there's a file
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const avatarRes = await uploadUserAvatar(currentUser.uid, formData);
        setUserData(prev => ({ ...prev, avatar: avatarRes.data.avatar }));
      }

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setProfileData({
        name: userData.name,
        email: userData.email,
        bio: userData.bio || '',
      });
    }
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!userData || !profileData) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  const stats = [
    { label: 'Items Shared', value: userData.items?.length || '0', color: 'text-blue-600' },
    { label: 'Items Received', value: userData.itemsReceived || '0', color: 'text-green-600' },
    { label: 'CO₂ Saved', value: `${userData.co2Saved || 0} lbs`, color: 'text-purple-600' },
    { label: 'Days Active', value: userData.daysActive || '0', color: 'text-orange-600' }
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 size={16} className="mr-2" /> Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X size={16} className="mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <img
                    src={avatarPreview || userData.avatar || 'https://i.pravatar.cc/150?u=default'}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    alt={userData.name}
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg"
                        title="Change profile picture"
                      >
                        <Camera size={16} />
                      </label>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <User size={16} className="mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <AtSign size={16} className="mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
                      <div className="text-gray-600 space-y-2">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {profileData.email}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          Joined {new Date(userData.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe size={18} className="mr-2" />
                About Me
              </h3>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Tell others about yourself)
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Share something about yourself, your interests, or what motivates you to share and recycle..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>
              ) : (
                <div>
                  {profileData.bio ? (
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  ) : (
                    <p className="text-gray-400 italic">No bio added yet. Click "Edit Profile" to add one!</p>
                  )}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Activity Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GreenScoreCard
              score={userData.points || 0}
              rank={userData.rank}
            />

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Achievements</h3>
                <Award size={20} className="text-yellow-500" />
              </div>
              <div className="space-y-3">
                {achievements.length > 0 ? (
                  achievements.slice(0, 4).map((ach, i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                      <span className="text-xl">🏅</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{ach.title}</p>
                        <p className="text-xs text-gray-600">{ach.description}</p>
                        <p className="text-xs text-green-600 font-medium">+{ach.points} pts</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No achievements yet. Start sharing items to earn your first achievement!</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award size={16} className="mr-2" />
                  View All Achievements
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:border-red-200"
                >
                  <span className="mr-2">🚪</span>
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;