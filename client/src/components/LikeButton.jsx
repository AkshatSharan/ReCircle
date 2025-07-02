// 📁 /client/components/LikeButton.jsx
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleLikeItem } from '../api/apiCalls';
import { useAuth } from '../contexts/AuthContext';

const LikeButton = ({ item, onLikeToggle }) => {
    const { currentUser } = useAuth();

    // ✅ Check if current user has liked this item
    const [isLiked, setIsLiked] = useState(
        item.likedBy?.some(userId => userId === currentUser?._id) || false
    );
    const [likesCount, setLikesCount] = useState(item.likedBy?.length || 0);
    const [loading, setLoading] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation(); // Prevent card swipe when clicking like button

        if (!currentUser || loading) return;

        setLoading(true);
        try {
            const res = await toggleLikeItem(item._id, currentUser.uid);
            setIsLiked(res.data.liked);
            setLikesCount(res.data.likesCount);

            if (onLikeToggle) {
                onLikeToggle(item._id, res.data.liked);
            }
        } catch (err) {
            console.error('Failed to toggle like:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors backdrop-blur-sm ${isLiked
                    ? 'bg-red-100/80 text-red-600 hover:bg-red-200/80'
                    : 'bg-white/80 text-gray-600 hover:bg-gray-100/80'
                }`}
        >
            <Heart
                size={16}
                className={isLiked ? 'fill-current' : ''}
            />
            <span className="text-sm font-medium">{likesCount}</span>
        </button>
    );
};

export default LikeButton;