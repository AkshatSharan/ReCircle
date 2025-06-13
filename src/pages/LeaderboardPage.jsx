import React, { useState } from 'react';
import { Trophy, TrendingUp, Calendar, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GreenScoreCard from '../components/common/GreenScoreCard';
import LeaderboardItem from '../components/common/LeaderboardItem';
import { currentUser, leaderboard, achievements } from '../data/mockData';

const LeaderboardPage = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  const currentUserEntry = leaderboard.find(entry => entry.user.id === currentUser.id);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">
          See how you rank among the ReCircle community
        </p>
      </div>

      {/* User Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <GreenScoreCard
          score={currentUser.greenScore}
          rank={3}
          monthlyIncrease={150}
        />
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            <Trophy className="text-yellow-500" size={20} />
          </div>
          <div className="space-y-2">
            {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center">
                <span className="text-lg mr-2">{achievement.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-500">+{achievement.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Time Filter */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <span className="text-sm font-medium text-gray-700">View:</span>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'all'].map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTimeFilter(filter)}
              >
                {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <Card className="mb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
        </div>
        <div className="flex justify-center items-end space-x-4 mb-6">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="bg-gray-200 rounded-lg p-4 mb-3 h-24 flex flex-col justify-end">
              <img
                src={leaderboard[1].user.avatar}
                alt={leaderboard[1].user.name}
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
            </div>
            <span className="text-2xl">🥈</span>
            <p className="text-sm font-medium text-gray-900">{leaderboard[1].user.name}</p>
            <p className="text-xs text-gray-500">{leaderboard[1].score} pts</p>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="bg-yellow-100 rounded-lg p-4 mb-3 h-32 flex flex-col justify-end">
              <img
                src={leaderboard[0].user.avatar}
                alt={leaderboard[0].user.name}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
            </div>
            <span className="text-3xl">🏆</span>
            <p className="text-sm font-medium text-gray-900">{leaderboard[0].user.name}</p>
            <p className="text-xs text-gray-500">{leaderboard[0].score} pts</p>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="bg-orange-100 rounded-lg p-4 mb-3 h-20 flex flex-col justify-end">
              <img
                src={leaderboard[2].user.avatar}
                alt={leaderboard[2].user.name}
                className="w-10 h-10 rounded-full mx-auto mb-2"
              />
            </div>
            <span className="text-xl">🥉</span>
            <p className="text-sm font-medium text-gray-900">{leaderboard[2].user.name}</p>
            <p className="text-xs text-gray-500">{leaderboard[2].score} pts</p>
          </div>
        </div>
      </Card>

      {/* Full Leaderboard */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Full Rankings</h2>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp size={16} className="mr-1" />
            Updated 5 min ago
          </div>
        </div>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <LeaderboardItem
              key={entry.user.id}
              entry={entry}
              isCurrentUser={entry.user.id === currentUser.id}
            />
          ))}
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="text-center">
          <Calendar className="text-blue-500 mx-auto mb-2" size={24} />
          <div className="text-xl font-bold text-gray-900">28</div>
          <p className="text-sm text-gray-600">Days Active</p>
        </Card>
        <Card className="text-center">
          <TrendingUp className="text-green-500 mx-auto mb-2" size={24} />
          <div className="text-xl font-bold text-gray-900">+12%</div>
          <p className="text-sm text-gray-600">This Week</p>
        </Card>
        <Card className="text-center">
          <Trophy className="text-yellow-500 mx-auto mb-2" size={24} />
          <div className="text-xl font-bold text-gray-900">4</div>
          <p className="text-sm text-gray-600">Achievements</p>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;