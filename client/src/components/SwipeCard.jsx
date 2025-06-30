// 📁 /client/components/SwipeCard.jsx
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SwipeCard = ({ item, currentUserId, style, className }) => {
  const [imageError, setImageError] = useState(false);

  // 🔥 Skip rendering if it's the user's own item
  if (!item || item?.user?.id === currentUserId) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 transition-transform duration-300 ${className}`}
      style={{ ...style, width: '100%', maxWidth: '400px', maxHeight: '500px' }}
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
          className="w-full h-64 object-cover"
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

        {/* Donor info */}
        <div className="mt-4 flex items-center space-x-2">
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
      </div>
    </motion.div>
  );
};

export default SwipeCard;
