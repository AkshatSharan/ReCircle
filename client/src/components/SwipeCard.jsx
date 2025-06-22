// 📁 /client/components/SwipeCard.jsx
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SwipeCard = ({ item, style, className }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white rounded-xl shadow-md overflow-hidden max-w-sm mx-auto border border-gray-100 ${className}`}
      style={{ ...style, width: '100%', maxWidth: '320px' }}
    >
      {/* Image with badge */}
      <div className="relative">
        <img
          src={
            imageError
              ? 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800'
              : item?.imageUrl
          }
          alt={item?.title}
          className="w-full h-44 object-cover"
          onError={() => setImageError(true)}
        />
        <span className="absolute top-2 right-2 px-3 py-1 bg-lime-100 text-lime-800 text-xs font-semibold rounded-full shadow-sm">
          excellent
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {item?.title || 'Untitled Item'}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {item?.description || 'No description provided.'}
        </p>

        {/* Category + Location */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          {item?.category && (
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {item.category}
            </span>
          )}
          {item?.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{item.location}</span>
            </div>
          )}
        </div>

        {/* Donor and Like/Pass */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={item?.user?.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=donor'}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">{item?.user?.name || 'Unknown'}</p>
              <p className="text-gray-500 text-xs">⭐ {item?.user?.points || 0} pts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 text-sm rounded-md text-gray-800">
              Pass
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-1 text-sm rounded-md text-white">
              Like
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
