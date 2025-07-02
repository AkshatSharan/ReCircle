import { MapPin, User, Calendar } from 'lucide-react';

const SwipeCard = ({ item, currentUser, onLikeToggle, className, style }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`} style={style}>
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>{item.user?.name || 'Anonymous'}</span>
            </div>
            {item.user?.location && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{item.user.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
