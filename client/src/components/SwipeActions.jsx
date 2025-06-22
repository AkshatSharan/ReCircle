import React from 'react';
import { X, Heart, RotateCcw } from 'lucide-react';

const SwipeActions = ({ onDislike, onLike, onUndo, canUndo = false, disabled = false }) => (
  <div className="flex justify-center items-center space-x-6 mt-8">
    {canUndo && (
      <button onClick={onUndo} disabled={disabled} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-full flex items-center justify-center">
        <RotateCcw className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-gray-600'}`} />
      </button>
    )}
    <button onClick={onDislike} disabled={disabled} className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg">
      <X className="w-6 h-6 text-white" />
    </button>
    <button onClick={onLike} disabled={disabled} className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg">
      <Heart className="w-6 h-6 text-white" />
    </button>
  </div>
);

export default SwipeActions;
