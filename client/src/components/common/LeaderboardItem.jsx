import React from 'react';
import { Crown } from 'lucide-react';

const LeaderboardItem = ({ entry, isCurrentUser }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg ${isCurrentUser ? 'bg-green-50 border border-green-200' : 'bg-white'
      }`}>
      <div className="flex items-center justify-center w-8 h-8 mr-4">
        {entry.rank <= 3 ? (
          <span className="text-lg">{entry.badge}</span>
        ) : (
          <span className="text-lg font-bold text-gray-500">#{entry.rank}</span>
        )}
      </div>

      <img
        src={entry.user.avatar}
        alt={entry.user.name}
        className="w-12 h-12 rounded-full mr-4"
      />

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">
          {entry.user.name}
          {isCurrentUser && <span className="text-green-600 ml-2">(You)</span>}
        </h4>
        <p className="text-sm text-gray-500">
          {entry.score.toLocaleString()} points
        </p>
      </div>

      {entry.rank === 1 && (
        <Crown className="text-yellow-500" size={20} />
      )}
    </div>
  );
};

export default LeaderboardItem;