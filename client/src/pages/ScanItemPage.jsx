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
• 🗑️ How to dispose if not recyclable find this only if the item is Not Recyclable  otherwise skip this how to dispose 


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


    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">♻️ Smart Recycle Scanner</h1>

      <div className="flex flex-col md:flex-row md:space-x-8 max-w-7xl mx-auto">
        {/* Scanner Section */}
        <div className="flex-1 space-y-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setRecycleInfo(null);
                setLastResults([]);
                setScanning(true);
              }}
              disabled={scanning}
              className={`px-6 py-2 rounded-md font-medium text-white transition-all duration-300 ${
                scanning ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Start Scan
            </button>
            <button
              onClick={handleStop}
              disabled={!scanning}
              className={`px-6 py-2 rounded-md font-medium text-white transition-all duration-300 ${
                !scanning ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Stop Scan
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Detected Objects</h3>
            {scanning ? (
              <p className="text-sm text-blue-500">Scanning... {detectedObjects.length} items detected</p>
            ) : lastResults.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-700">
                {lastResults.map((obj, i) => (
                  <li key={i} className="flex justify-between">
                    <span className="capitalize">{obj.class}</span>
                    <span>{(obj.score * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No detection data</p>
            )}
          </div>
        </div>

        {/* Recycling Info + Tips */}
        <div className="w-full md:w-1/3 mt-10 md:mt-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-3">♻️ Recyclability Info</h2>
            {recycleInfo ? (
              recycleInfo === "Could not fetch recycling info." ? (
                <p className="text-sm text-red-500">{recycleInfo}</p>
              ) : (
                recycleInfo.split('\n').map((line, i) => (
                  <p key={i} className="text-sm text-gray-700 mb-2">{line}</p>
                ))
              )
            ) : (
              <p className="text-sm text-gray-400">Complete a scan to receive item-specific info.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-200">
            <h2 className="text-xl font-semibold text-yellow-700 mb-4">🌍 Sustainability Tips</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>♻️ Sort plastics, metals, and compostables</li>
              <li>🧴 Rinse containers before recycling</li>
              <li>📦 Flatten boxes to save space</li>
              <li>🌱 Compost food and garden waste</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
    </AnimatePresence>
    </>
  );
};

export default ScanItemPage;
