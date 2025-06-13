import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import Card from '../ui/Card';

const GreenScoreCard = ({ score, rank, monthlyIncrease }) => {
  return (
    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Green Score</h3>
          <p className="text-3xl font-bold">{score.toLocaleString()}</p>
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded-full">
          <Award size={24} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp size={16} className="mr-1" />
          <span className="text-sm opacity-90">
            +{monthlyIncrease} this month
          </span>
        </div>
        <span className="text-sm opacity-90">
          Rank #{rank}
        </span>
      </div>
    </Card>
  );
};

export default GreenScoreCard;