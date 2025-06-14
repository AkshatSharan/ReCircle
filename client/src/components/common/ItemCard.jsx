import React from 'react';
import { MapPin, Star } from 'lucide-react';
import Card from '../ui/Card';

const ItemCard = ({ item, onLike, onPass }) => {
  const conditionColors = {
    excellent: 'text-green-600 bg-green-100',
    good: 'text-blue-600 bg-blue-100',
    fair: 'text-yellow-600 bg-yellow-100'
  };

  return (
    <Card padding="none" className="max-w-sm mx-auto overflow-hidden">
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[item.condition]}`}>
            {item.condition}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
            {item.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            {item.location}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={item.owner.avatar}
              alt={item.owner.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{item.owner.name}</p>
              <div className="flex items-center">
                <Star size={12} className="text-yellow-500 mr-1" />
                <span className="text-xs text-gray-500">{item.owner.greenScore} pts</span>
              </div>
            </div>
          </div>

          {onLike && onPass && (
            <div className="flex space-x-2">
              <button
                onClick={onPass}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Pass
              </button>
              <button
                onClick={onLike}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Like
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;