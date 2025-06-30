import React, { useEffect, useState } from 'react';
import {
  Mail, MapPin, Calendar, Award, Settings, Camera,
  Edit3, Save, X
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}`);
        const data = await res.json();
        setUserData(data.user);
        setProfileData({
          name: data.user.name,
          email: data.user.email,
          location: data.user.location || '',
          bio: data.user.bio || '',
          interests: data.user.interests || []
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
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

    if (currentUser?.uid) {
      fetchProfile();
      fetchAchievements();
    }
  }, [currentUser]);

  const handleSave = async () => {
  try {
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}/avatar`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUserData(prev => ({ ...prev, avatar: data.avatar }));
    }

    // (Optional) Save other profile updates here

    setIsEditing(false);
    setAvatarFile(null);
  } catch (err) {
    console.error('Failed to update avatar:', err);
  }
};

  const handleCancel = () => {
    if (userData) {
      setProfileData({
        name: userData.name,
        email: userData.email,
        location: userData.location || '',
        bio: userData.bio || '',
        interests: userData.interests || []
      });
    }
    setIsEditing(false);
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
              <Save size={16} className="mr-2" /> Save
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
                  src={userData.avatar || 'https://i.pravatar.cc/150?u=default'}
                  className="w-24 h-24 rounded-full object-cover"
                  alt={userData.name}
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-1">{profileData.name}</h2>
                    <div className="text-gray-600 space-y-1">
                      <div className="flex items-center"><Mail size={16} className="mr-2" />{profileData.email}</div>
                      <div className="flex items-center"><MapPin size={16} className="mr-2" />{profileData.location}</div>
                      <div className="flex items-center"><Calendar size={16} className="mr-2" />Joined {new Date(userData.createdAt).toLocaleDateString()}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-2">About Me</h3>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
                rows={4}
              />
            ) : (
              <p className="text-gray-700">{profileData.bio}</p>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-2">Interests</h3>
            {isEditing ? (
              <input
                type="text"
                value={profileData.interests.join(', ')}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((tag, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-2">Activity Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
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
            rank="-"
            monthlyIncrease={150}
          />

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <Award size={20} className="text-yellow-500" />
            </div>
            <div className="space-y-3">
              {achievements.slice(0, 4).map((ach, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-xl">🏅</span>
                  <div>
                    <p className="text-sm font-medium">{ach.title}</p>
                    <p className="text-xs text-gray-500">+{ach.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start"><Settings size={16} className="mr-2" />Account Settings</Button>
              <Button variant="outline" className="w-full justify-start"><Award size={16} className="mr-2" />View All Achievements</Button>
              <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50"><span className="mr-2">🚪</span> Sign Out</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
