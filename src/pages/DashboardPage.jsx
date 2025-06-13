import React from 'react';
import { PlusCircle, Camera, MapPin, BarChart2, Award, RefreshCw, Leaf } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';

const DashboardPage = ({ currentUser }) => {
  const quickActions = [
    {
      title: "Add Item",
      description: "Post a reusable item for donation",
      icon: <PlusCircle className="text-green-600" size={24} />,
      onClick: () => {
        // Navigation or modal trigger for adding item
      }
    },
    {
      title: "Scan Item",
      description: "Check recyclability of items",
      icon: <Camera className="text-blue-600" size={24} />,
      onClick: () => {
        // Open camera or scanner
      }
    },
    {
      title: "Find Centers",
      description: "Locate recycling & donation centers",
      icon: <MapPin className="text-yellow-600" size={24} />,
      onClick: () => {
        // Navigate to center locator
      }
    },
    {
      title: "View Stats",
      description: "Track your sustainability journey",
      icon: <BarChart2 className="text-purple-600" size={24} />,
      onClick: () => {
        // Navigate to stats dashboard
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name} 🌿</h1>
        <p className="text-gray-600">Here’s your eco-impact dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <GreenScoreCard
            score={currentUser.greenScore}
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
    </div>
  );
};

export default DashboardPage;