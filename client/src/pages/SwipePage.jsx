// 📁 /client/pages/SwipePage.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import TinderCard from 'react-tinder-card';
import SwipeCard from '../components/SwipeCard';
import SwipeActions from '../components/SwipeActions';
import SwipeStats from '../components/SwipeStats';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getAuth } from 'firebase/auth'; // Firebase Auth

const SwipePage = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeActions, setSwipeActions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // ✅

  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () => Array(items.length).fill(0).map(() => React.createRef()),
    [items.length]
  );

  useEffect(() => {
    // ✅ Get current user ID from Firebase
    const auth = getAuth();
    const user = auth.currentUser;
    setCurrentUserId(user?.uid || null);

    // Fetch items from backend
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items');
        setItems(res.data.items);
        setCurrentIndex(res.data.items.length - 1);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < items.length - 1;
  const canSwipe = currentIndex >= 0;

  // 🔔 Send like notification to backend
const handleRightSwipe = async (itemId) => {
  try {
    const auth = getAuth(); // in case it's needed
    const user = auth.currentUser;
    const token = await user.getIdToken();

    await axios.post(`http://localhost:5000/api/items/${itemId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Like notification sent');
  } catch (error) {
    console.error('❌ Swipe like failed:', error);
  }
};


  const swiped = (direction, item, index) => {
    setSwipeActions((prev) => [
      ...prev,
      { itemId: item._id, action: direction === 'right' ? 'like' : 'dislike', timestamp: new Date().toISOString() }
    ]);
    updateCurrentIndex(index - 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const outOfFrame = (item, idx) => {
    if (currentIndexRef.current >= idx) {
      childRefs[idx]?.current?.restoreCard();
    }
  };

  const swipe = async (dir) => {
    if (canSwipe && !isAnimating) {
      await childRefs[currentIndex]?.current?.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack || isAnimating) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
    setSwipeActions((prev) => prev.slice(0, -1));
  };

  const stats = {
    totalViewed: swipeActions.length,
    totalLiked: swipeActions.filter((a) => a.action === 'like').length,
    totalDisliked: swipeActions.filter((a) => a.action === 'dislike').length,
    remaining: Math.max(0, currentIndex + 1),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900">Discover Items</h1>
          </div>
          <div className="w-10 h-10" />
        </div>

        <SwipeStats {...stats} />

        <div className="relative h-[480px] mb-4">
          {items.map((item, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="absolute inset-0"
              key={item._id}
              onSwipe={(dir) => swiped(dir, item, index)}
              onCardLeftScreen={() => outOfFrame(item, index)}
              preventSwipe={['up', 'down']}
            >
              <SwipeCard
                item={item}
                currentUserId={currentUserId} // ✅ Pass here
                className="w-full h-full cursor-grab active:cursor-grabbing"
                style={{
                  zIndex: items.length - index,
                  transform: `scale(${1 - (Math.max(0, currentIndex - index)) * 0.05}) translateY(${(Math.max(0, currentIndex - index)) * 4}px)`,
                  opacity: index <= currentIndex + 2 ? 1 : 0,
                }}
              />
            </TinderCard>
          ))}

          {currentIndex < 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All done!</h3>
                <p className="text-gray-600 mb-6">You've viewed all available items. Check back later for more!</p>
                <button
                  onClick={() => {
                    setCurrentIndex(items.length - 1);
                    setSwipeActions([]);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        <SwipeActions
          onDislike={() => swipe('left')}
          onLike={() => swipe('right')}
          onUndo={goBack}
          canUndo={canGoBack}
          disabled={!canSwipe || isAnimating}
        />
      </div>
    </div>
  );
};

export default SwipePage;
