import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, X } from 'lucide-react';
import { addItem } from '../api/apiCalls';
import { useAuth } from '../contexts/AuthContext';

const AddItemPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('available');

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('uid', currentUser.uid);
    formData.append('status', status);

    try {
      await addItem(formData);
      alert('Item added successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to add item');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Add Reusable Item</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg p-6 rounded-xl border border-gray-100">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Item Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Old Books, Glass Jar"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the condition and usage of the item."
            required
          ></textarea>
        </div>

        <div>
  <label className="block text-sm font-medium mb-1 text-gray-700">Item Status</label>
  <select
    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    required
  >
    <option value="available">Available</option>
    <option value="claimed">Claimed</option>
    <option value="donated">Donated</option>
  </select>
</div>


        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Upload Image</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50 relative"
            onClick={() => document.getElementById('imageInput').click()}
          >
            {!preview ? (
              <>
                <ImageIcon className="mx-auto text-gray-400 mb-2" size={36} />
                <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
              </>
            ) : (
              <div className="relative inline-block w-full h-48 overflow-hidden rounded-lg">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            )}
          </div>

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            required={!image}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-md"
        >
          Submit Item
        </button>
      </form>
    </div>
  );
};

export default AddItemPage;
