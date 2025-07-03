import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const videoConstraints = { facingMode: 'environment' };

const ScanItemPage = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const uploadCanvasRef = useRef(null);

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [lastResults, setLastResults] = useState([]);
  const [recycleInfo, setRecycleInfo] = useState(null);

  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let interval;
    if (model && scanning) {
      interval = setInterval(() => detectFrame(), 500);
    }
    return () => clearInterval(interval);
  }, [model, scanning]);

  const detectFrame = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);
      setDetectedObjects(predictions);
      draw(predictions);
    }
  };

  const draw = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = webcamRef.current.video;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(pred => {
      const [x, y, w, h] = pred.bbox;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = '#22c55e';
      ctx.font = '16px Arial';
      ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);
    });
  };

  const handleStop = async () => {
    setScanning(false);
    setLastResults(detectedObjects);
    if (detectedObjects.length > 0) {
      const uniqueItems = [...new Set(detectedObjects.map(obj => obj.class))].join(', ');
      const res = await getRecycleInfo(uniqueItems);
      setRecycleInfo(res);
    }
  };

  const getRecycleInfo = async (items) => {
    try {
      const prompt = `Give me quick recycling info for the following items. For each, say:
• ♻️ Recyclable or ❌ Not Recyclable  
• 🧽 Any prep needed (e.g. rinse, flatten)  
• 🗑️ How to dispose if not recyclable  

Make it short, clear, and a bit fun:
${items}`;
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return "Could not fetch recycling info.";
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !model) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = uploadCanvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const predictions = await model.detect(canvas);
      setDetectedObjects(predictions);
      setLastResults(predictions);
      drawUploadResults(predictions, ctx);

      const uniqueItems = [...new Set(predictions.map(p => p.class))].join(', ');
      const res = await getRecycleInfo(uniqueItems);
      setRecycleInfo(res);
    };
  };

  const drawUploadResults = (predictions, ctx) => {
    predictions.forEach(pred => {
      const [x, y, w, h] = pred.bbox;
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = '#f97316';
      ctx.font = '16px Arial';
      ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);
    });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="scanner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-white py-10 px-4"
        >
          <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
            ♻️ Smart Recycle Scanner
          </h1>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
            {/* LEFT SECTION - Scanner + Upload */}
            <div className="flex-1 space-y-6">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              </div>

              {/* Upload from Gallery */}
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 text-center text-gray-600 cursor-pointer hover:border-green-500 transition duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                📸 <span className="font-medium">Upload an Image</span> from your gallery
              </label>

              {/* Start / Stop buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setRecycleInfo(null);
                    setLastResults([]);
                    setScanning(true);
                  }}
                  disabled={scanning}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${
                    scanning
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Start Scan
                </button>
                <button
                  onClick={handleStop}
                  disabled={!scanning}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${
                    !scanning
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Stop Scan
                </button>
              </div>

              {/* Detected Objects */}
              <div className="bg-gray-100 rounded-xl p-4 shadow border">
                <h2 className="font-semibold text-lg text-gray-800 mb-3">🧠 Detected Items</h2>
                {scanning ? (
                  <p className="text-sm text-blue-500">Scanning... {detectedObjects.length} items</p>
                ) : lastResults.length > 0 ? (
                  <ul className="text-sm text-gray-700 space-y-2">
                    {lastResults.map((obj, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="capitalize">{obj.class}</span>
                        <span>{(obj.score * 100).toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No items detected yet.</p>
                )}
              </div>

              <canvas ref={uploadCanvasRef} style={{ display: 'none' }} />
            </div>

            {/* RIGHT SECTION - Info */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Recycling Info */}
              <div className="bg-white border border-green-300 rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-semibold text-green-800 mb-4">♻️ Recyclability Info</h2>
                {recycleInfo ? (
                  recycleInfo === 'Could not fetch recycling info.' ? (
                    <p className="text-sm text-red-500">{recycleInfo}</p>
                  ) : (
                    recycleInfo.split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-gray-700 mb-1">{line}</p>
                    ))
                  )
                ) : (
                  <p className="text-sm text-gray-500">Scan or upload to see recycling instructions.</p>
                )}
              </div>

              {/* Sustainability Tips */}
              <div className="bg-white border border-yellow-300 rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-semibold text-yellow-700 mb-4">🌍 Sustainability Tips</h2>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>Rinse containers before recycling</li>
                  <li>Flatten cardboard boxes</li>
                  <li>Sort plastics, metals, and paper</li>
                  <li>Compost food waste whenever possible</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ScanItemPage;
