import React from 'react';
import { Heart, X, Eye } from 'lucide-react';

const SwipeStats = ({ totalViewed, totalLiked, totalDisliked, remaining }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-4 gap-4 text-center">
    {[['Viewed', Eye, totalViewed, 'blue'], ['Liked', Heart, totalLiked, 'green'], ['Passed', X, totalDisliked, 'red'], ['Left', null, remaining, 'purple']].map(([label, Icon, value, color]) => (
      <div className="flex flex-col items-center" key={label}>
        <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center mb-1`}>
          {Icon ? <Icon className={`w-4 h-4 text-${color}-600`} /> : <span className={`text-sm font-bold text-${color}-600`}>{value}</span>}
        </div>
        <span className={`text-lg font-bold text-${color}-600`}>{value}</span>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
    ))}
  </div>
);

export default SwipeStats;
