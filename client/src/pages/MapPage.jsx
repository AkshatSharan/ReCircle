import React, { useState } from 'react'
import { MapPin, Navigation, Filter, Phone, Clock, ExternalLink } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { donationCenters } from '../data/mockData'

const MapPage = () => {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCenter, setSelectedCenter] = useState(null)

  const filteredCenters =
    selectedType === 'all'
      ? donationCenters
      : donationCenters.filter(center => center.type === selectedType)

  const getTypeColor = type => {
    switch (type) {
      case 'donation':
        return 'bg-blue-500'
      case 'recycling':
        return 'bg-green-500'
      case 'electronics':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeIcon = type => {
    switch (type) {
      case 'donation':
        return '🎁'
      case 'recycling':
        return '♻️'
      case 'electronics':
        return '📱'
      default:
        return '📍'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Centers</h1>
        <p className="text-gray-600">Locate nearby donation and recycling centers</p>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <span className="text-sm font-medium text-gray-700">Filter by type:</span>
          </div>
          <Button variant="ghost" size="sm">
            <Navigation className="mr-2" size={16} />
            Use My Location
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'donation', 'recycling', 'electronics'].map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="none" className="h-96 lg:h-full">
          <div className="bg-gray-100 h-full rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
              <MapPin className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-600 mb-2">Interactive Map</p>
              <p className="text-sm text-gray-500">Google Maps integration would go here</p>
            </div>

            {filteredCenters.map((center, index) => (
              <button
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className={`absolute w-8 h-8 ${getTypeColor(center.type)} rounded-full flex items-center justify-center text-white text-xs hover:scale-110 transition-transform`}
                style={{
                  top: `${20 + index * 25}%`,
                  left: `${30 + index * 20}%`
                }}
              >
                {getTypeIcon(center.type)}
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4 max-h-96 lg:max-h-full overflow-y-auto">
          {filteredCenters.map(center => (
            <Card
              key={center.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedCenter?.id === center.id ? 'ring-2 ring-green-500' : ''
                }`}
              onClick={() => setSelectedCenter(center)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 ${getTypeColor(center.type)} rounded-full mr-2`} />
                    <h3 className="font-semibold text-gray-900">{center.name}</h3>
                  </div>

                  <div className="flex items-start text-gray-600 text-sm mb-2">
                    <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                    <span>{center.address}</span>
                  </div>

                  {center.phone && (
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Phone size={14} className="mr-1" />
                      <span>{center.phone}</span>
                    </div>
                  )}

                  {center.hours && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>{center.hours}</span>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm">
                  <ExternalLink size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedCenter && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{selectedCenter.name}</h3>
            <Button size="sm">Get Directions</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Type:</strong>{' '}
                {selectedCenter.type.charAt(0).toUpperCase() + selectedCenter.type.slice(1)}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Address:</strong> {selectedCenter.address}
              </p>
            </div>
            <div>
              {selectedCenter.phone && (
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> {selectedCenter.phone}
                </p>
              )}
              {selectedCenter.hours && (
                <p className="text-gray-600 mb-2">
                  <strong>Hours:</strong> {selectedCenter.hours}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="text-center">
          <div className="text-2xl mb-2">🎁</div>
          <div className="text-xl font-bold text-blue-600 mb-1">
            {donationCenters.filter(c => c.type === 'donation').length}
          </div>
          <p className="text-sm text-gray-600">Donation Centers</p>
        </Card>

        <Card className="text-center">
          <div className="text-2xl mb-2">♻️</div>
          <div className="text-xl font-bold text-green-600 mb-1">
            {donationCenters.filter(c => c.type === 'recycling').length}
          </div>
          <p className="text-sm text-gray-600">Recycling Centers</p>
        </Card>

        <Card className="text-center">
          <div className="text-2xl mb-2">📱</div>
          <div className="text-xl font-bold text-purple-600 mb-1">
            {donationCenters.filter(c => c.type === 'electronics').length}
          </div>
          <p className="text-sm text-gray-600">Electronics Recycling</p>
        </Card>
      </div>
    </div>
  )
}

export default MapPage
