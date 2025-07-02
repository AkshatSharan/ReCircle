import React, { useEffect, useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import SwipeCard from '../components/SwipeCard';
import SwipeActions from '../components/SwipeActions';
import SwipeStats from '../components/SwipeStats';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toggleLikeItem, getAllItems } from '../api/apiCalls'; // ✅ Import getAllItems

const SwipePage = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeActions, setSwipeActions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const { currentUser } = useAuth();

  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () => Array(items.length).fill(0).map(() => React.createRef()),
    [items.length]
  );
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // ✅ Use the correct API call function
        const res = await getAllItems(currentUser.uid);
        setItems(res.data.items);
        setCurrentIndex(res.data.items.length - 1);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (currentUser?.uid) {
      fetchItems();
    }
  }, [currentUser]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < items.length - 1;
  const canSwipe = currentIndex >= 0;

  // ✅ Handle like when swiping right
  const handleLikeItem = async (itemId) => {
    if (!currentUser?.uid) return;

    try {
      await toggleLikeItem(itemId, currentUser.uid);
      console.log('✅ Item liked successfully');

      // Update the item in local state to reflect the like
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId
            ? {
              ...item,
              likedBy: [...(item.likedBy || []), currentUser._id],
              likesCount: (item.likesCount || 0) + 1
            }
            : item
        )
      );
    } catch (error) {
      console.error('❌ Failed to like item:', error);
    }
  };

  const swiped = async (direction, item, index) => {
    // ✅ Handle like when swiping right
    if (direction === 'right') {
      await handleLikeItem(item._id);
    }

    setSwipeActions((prev) => [
      ...prev,
      {
        itemId: item._id,
        action: direction === 'right' ? 'like' : 'dislike',
        timestamp: new Date().toISOString()
      }
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
    const lastAction = swipeActions[swipeActions.length - 1];

    // ✅ If the last action was a like, remove it
    if (lastAction && lastAction.action === 'like') {
      try {
        await toggleLikeItem(lastAction.itemId, currentUser.uid); // This will unlike

        // Update local state to remove the like
        setItems(prevItems =>
          prevItems.map(item =>
            item._id === lastAction.itemId
              ? {
                ...item,
                likedBy: (item.likedBy || []).filter(id => id !== currentUser._id),
                likesCount: Math.max(0, (item.likesCount || 1) - 1)
              }
              : item
          )
        );
      } catch (error) {
        console.error('❌ Failed to unlike item:', error);
      }
    }

    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
    setSwipeActions((prev) => prev.slice(0, -1));
  };

  // ✅ Handle like toggle from SwipeCard component
  const handleLikeToggle = async (itemId, liked) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? {
            ...item,
            likedBy: liked
              ? [...(item.likedBy || []), currentUser._id]
              : (item.likedBy || []).filter(id => id !== currentUser._id),
            likesCount: liked
              ? (item.likesCount || 0) + 1
              : Math.max(0, (item.likesCount || 1) - 1)
          }
          : item
      )
    );
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

        <div className="relative h-[480px] mb-4 overflow-hidden">
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
                currentUser={currentUser}
                onLikeToggle={handleLikeToggle}
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
