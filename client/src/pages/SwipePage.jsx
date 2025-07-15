import React, { useEffect, useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import SwipeCard from '../components/SwipeCard';
import SwipeActions from '../components/SwipeActions';
import SwipeStats from '../components/SwipeStats';
import { ArrowLeft, Sparkles, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toggleLikeItem, getAllItems } from '../api/apiCalls';
import clsx from 'clsx';

const SwipePage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeActions, setSwipeActions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useAuth();

  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () => Array(filteredItems.length).fill(0).map(() => React.createRef()),
    [filteredItems.length]
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getAllItems(currentUser.uid);
        setItems(res.data.items);
        setFilteredItems(res.data.items);
        setCurrentIndex(res.data.items.length - 1);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (currentUser?.uid) fetchItems();
  }, [currentUser]);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentIndex(filtered.length - 1);
  }, [searchTerm, items]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < filteredItems.length - 1;
  const canSwipe = currentIndex >= 0;

  const handleLikeItem = async (itemId) => {
    if (!currentUser?.uid) return;
    try {
      await toggleLikeItem(itemId, currentUser.uid);
      setItems((prevItems) =>
        prevItems.map((item) =>
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
    if (direction === 'right') await handleLikeItem(item._id);
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

    if (lastAction && lastAction.action === 'like') {
      try {
        await toggleLikeItem(lastAction.itemId, currentUser.uid);
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === lastAction.itemId
              ? {
                  ...item,
                  likedBy: (item.likedBy || []).filter((id) => id !== currentUser._id),
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

  const stats = {
    totalViewed: swipeActions.length,
    totalLiked: swipeActions.filter((a) => a.action === 'like').length,
    totalDisliked: swipeActions.filter((a) => a.action === 'dislike').length,
    remaining: Math.max(0, currentIndex + 1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 overflow-hidden">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 backdrop-blur-md bg-white/70 rounded-xl p-3 shadow-md">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" /> Discover
          </h1>

          {/* Search Bar */}
          <div className="relative w-32">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-sm rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <SwipeStats {...stats} />

        {/* CARDS */}
        <div className="relative h-[500px] mb-6">
          {filteredItems.map((item, index) => (
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
                onLikeToggle={() => {}}
                className="w-full h-full rounded-3xl border bg-white shadow-xl backdrop-blur-sm cursor-grab active:cursor-grabbing"
                style={{
                  zIndex: filteredItems.length - index,
                  transform: `scale(${1 - (Math.max(0, currentIndex - index)) * 0.05}) translateY(${(Math.max(0, currentIndex - index)) * 6}px)`,
                  opacity: index <= currentIndex + 2 ? 1 : 0
                }}
              />
            </TinderCard>
          ))}

          {currentIndex < 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">You're all caught up!</h3>
              <p className="text-sm text-gray-600 mb-4">You've swiped through all items.</p>
              <button
                onClick={() => {
                  setCurrentIndex(filteredItems.length - 1);
                  setSwipeActions([]);
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition"
              >
                Restart
              </button>
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