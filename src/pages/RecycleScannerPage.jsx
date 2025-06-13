import React, { useState } from 'react';
import { Camera, CheckCircle, AlertCircle, Info, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const RecycleScannerPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const mockScanResult = {
    category: 'recyclable',
    confidence: 92,
    instructions: 'This plastic water bottle can be recycled in your curbside recycling bin.',
    tips: [
      'Remove the cap and label before recycling',
      'Rinse out any remaining liquid',
      'Crush the bottle to save space in your recycling bin'
    ]
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(mockScanResult);
    }, 2000);
  };

  const handleNewScan = () => {
    setScanResult(null);
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'recyclable':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Recyclable ♻️'
        };
      case 'compostable':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Compostable 🌱'
        };
      case 'hazardous':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'Hazardous ⚠️'
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'General Waste 🗑️'
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recycle Scanner</h1>
        <p className="text-gray-600">
          Scan items to learn how to dispose of them properly
        </p>
      </div>

      {!scanResult ? (
        <Card className="text-center">
          {/* Camera Preview Area */}
          <div className="bg-gray-100 rounded-lg p-12 mb-6 border-2 border-dashed border-gray-300">
            {isScanning ? (
              <div className="flex flex-col items-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-600 mt-4">Analyzing item...</p>
                <p className="text-sm text-gray-500 mt-2">Please hold steady</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Camera className="text-gray-400 mb-4" size={64} />
                <p className="text-gray-600 mb-2">Point your camera at an item</p>
                <p className="text-sm text-gray-500">
                  We'll help you identify the best way to dispose of it
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={handleScan}
            disabled={isScanning}
            size="lg"
            className="w-full md:w-auto"
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Scan Result */}
          <Card>
            <div className="text-center mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${getCategoryInfo(scanResult.category).bgColor} mb-4`}>
                {React.createElement(getCategoryInfo(scanResult.category).icon, {
                  className: `${getCategoryInfo(scanResult.category).color} mr-2`,
                  size: 20
                })}
                <span className={`font-semibold ${getCategoryInfo(scanResult.category).color}`}>
                  {getCategoryInfo(scanResult.category).title}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">{scanResult.confidence}%</span>
                <p className="text-sm text-gray-500">Confidence</p>
              </div>
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
              <p className="text-gray-700 mb-4">{scanResult.instructions}</p>

              <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
              <ul className="space-y-2">
                {scanResult.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleNewScan}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw size={20} className="mr-2" />
              Scan Another
            </Button>
            <Button
              variant="primary"
              className="flex-1"
            >
              Share Result
            </Button>
          </div>

          {/* Points Earned */}
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-center text-green-700">
              <CheckCircle className="mr-2" size={20} />
              <span className="font-medium">+25 Green Points earned!</span>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Scans */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Plastic Bottle', 'Cardboard Box', 'Battery'].map((item, index) => (
            <Card key={index} padding="sm" className="text-center">
              <div className="text-sm font-medium text-gray-900 mb-1">{item}</div>
              <div className={`text-xs ${index === 2 ? 'text-red-600' : 'text-green-600'}`}>
                {index === 2 ? 'Hazardous' : 'Recyclable'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecycleScannerPage;