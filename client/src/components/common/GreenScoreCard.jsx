import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import Card from '../ui/Card';

const GreenScoreCard = ({ score, rank, userData }) => {
  if (!userData) return null;
  return (
    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Green Score</h3>
          <p className="text-3xl font-bold">{score.toLocaleString()}</p>
        </div>
        <div className="bg-red bg-opacity-20 p-3 rounded-full">
          <img
            src={userData.avatar || 'https://i.pravatar.cc/150?u=default'}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            alt={userData.name}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm opacity-90">
          Rank #{rank}
        </span>
      </div>
    </Card>
  );
};

export default GreenScoreCard;