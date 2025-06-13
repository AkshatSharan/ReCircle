import React, { useState } from 'react';
import { Heart, X, Upload, Plus } from 'lucide-react';
import ItemCard from '../components/common/ItemCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { mockItems } from '../data/mockData';

const ReuseMatchingPage = () => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'good',
  });

  const currentItem = mockItems[currentItemIndex];

  const handleLike = () => {
    console.log('Liked item:', currentItem.id);
    nextItem();
  };

  const handlePass = () => {
    console.log('Passed item:', currentItem.id);
    nextItem();
  };

  const nextItem = () => {
    setCurrentItemIndex((prev) => (prev + 1) % mockItems.length);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    console.log('Uploading item:', uploadData);
    setShowUploadForm(false);
    setUploadData({ title: '', description: '', category: '', condition: 'good' });
  };

  if (showUploadForm) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Share an Item</h1>
          <Button variant="ghost" onClick={() => setShowUploadForm(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Click to upload photos or drag and drop</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Item Title
              </label>
              <input
                type="text"
                id="title"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="What are you sharing?"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your item..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Books">Books</option>
                  <option value="Toys & Games">Toys & Games</option>
                  <option value="Home & Garden">Home & Garden</option>
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  id="condition"
                  value={uploadData.condition}
                  onChange={(e) => setUploadData({ ...uploadData, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Share Item
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Items</h1>
          <p className="text-gray-600">Swipe to discover items near you</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)} className="flex items-center">
          <Plus size={20} className="mr-2" />
          Share Item
        </Button>
      </div>

      <div className="relative mb-8">
        <ItemCard item={currentItem} onLike={handleLike} onPass={handlePass} />
      </div>

      {/* Swipe Actions */}
      <div className="flex justify-center space-x-8">
        <button
          onClick={handlePass}
          className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="text-gray-600" size={24} />
        </button>
        <button
          onClick={handleLike}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
        >
          <Heart className="text-green-600" size={24} />
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          {mockItems.length - currentItemIndex - 1} more items to explore
        </p>
      </div>
    </div>
  );
};

export default ReuseMatchingPage;