import React, { useState } from 'react';
import { User, Mail, MapPin, Calendar, Award, Settings, Camera, Edit3, Save, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import { currentUser, achievements } from '../data/mockData';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    location: 'Seattle, WA',
    bio: 'Passionate about sustainability and making a positive impact on our planet. Love finding new homes for items and reducing waste!',
    interests: ['Recycling', 'Upcycling', 'Zero Waste', 'Sustainable Living']
  });

  const handleSave = () => {
    // In a real app, you'd save to backend here
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      name: currentUser.name,
      email: currentUser.email,
      location: 'Seattle, WA',
      bio: 'Passionate about sustainability and making a positive impact on our planet. Love finding new homes for items and reducing waste!',
      interests: ['Recycling', 'Upcycling', 'Zero Waste', 'Sustainable Living']
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Items Shared', value: '24', color: 'text-blue-600' },
    { label: 'Items Received', value: '18', color: 'text-green-600' },
    { label: 'CO₂ Saved', value: '45 lbs', color: 'text-purple-600' },
    { label: 'Days Active', value: '89', color: 'text-orange-600' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit3 size={16} className="mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save size={16} className="mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span>Joined {new Date(currentUser.joinedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Bio */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700">{profileData.bio}</p>
            )}
          </Card>

          {/* Interests */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
            {isEditing ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Add or remove interests (comma-separated)</p>
                <input
                  type="text"
                  value={profileData.interests.join(', ')}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    interests: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Recycling, Upcycling, Zero Waste..."
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Green Score */}
          <GreenScoreCard
            score={currentUser.greenScore}
            rank={3}
            monthlyIncrease={150}
          />

          {/* Recent Achievements */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
              <Award className="text-yellow-500" size={20} />
            </div>
            <div className="space-y-3">
              {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="flex items-center">
                  <span className="text-2xl mr-3">{achievement.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-500">+{achievement.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Settings size={16} className="mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award size={16} className="mr-2" />
                View All Achievements
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;