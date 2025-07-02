// components/OSMMap.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Navigation, 
  Filter, 
  Search, 
  Loader2, 
  ArrowLeft, 
  Layers,
  X,
  Menu,
  ChevronDown
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const filtersConfig = [
  { id: 'all', label: 'All Centers', color: 'bg-blue-500', icon: '📍' },
  { id: 'recycling', label: 'Recycling', color: 'bg-green-500', icon: '♻️' },
  { id: 'social_facility', label: 'Donation', color: 'bg-purple-500', icon: '🏠' },
];

const OSMMap = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationQuery = searchParams.get("location");
  const [center, setCenter] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // ... your existing functions (fetchLocationData, fetchUserLocation, etc.)
  const fetchLocationData = async (location) => {
    setLoading(true);
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
      const geoData = await geoRes.json();
      if (!geoData[0]) return setResults([]);

      const { lat, lon } = geoData[0];
      setCenter([parseFloat(lat), parseFloat(lon)]);

      const overpassQuery = `
        [out:json];
        (
          node["amenity"="recycling"](around:5000,${lat},${lon});
          node["amenity"="social_facility"](around:5000,${lat},${lon});
        );
        out body;
      `;
      const poiRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
      const poiData = await poiRes.json();
      setResults(poiData.elements || []);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setLoading(true);
        try {
          const overpassQuery = `
            [out:json];
            (
              node["amenity"="recycling"](around:5000,${latitude},${longitude});
              node["amenity"="social_facility"](around:5000,${latitude},${longitude});
            );
            out body;
          `;
          const poiRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
          const poiData = await poiRes.json();
          setResults(poiData.elements || []);
        } catch (error) {
          console.error("Error fetching location data:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    if (locationQuery) {
      fetchLocationData(locationQuery);
    } else {
      fetchUserLocation();
    }
  }, [locationQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setSearchParams({ location: cityInput });
      setShowSidebar(false);
    }
  };

  const filteredResults = useMemo(() =>
    selectedFilter === 'all' ? results : results.filter(r => r.tags?.amenity === selectedFilter),
    [results, selectedFilter]
  );

  const filterCounts = useMemo(() => {
    const counts = {
      all: results.length,
      recycling: results.filter(r => r.tags?.amenity === 'recycling').length,
      social_facility: results.filter(r => r.tags?.amenity === 'social_facility').length,
    };
    return filtersConfig.map(f => ({ ...f, count: counts[f.id] || 0 }));
  }, [results]);

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      recycling: '♻️',
      social_facility: '🏠',
    };
    return iconMap[amenity] || '📍';
  };

  const getAmenityColor = (amenity) => {
    const colorMap = {
      recycling: 'border-l-4 border-green-500 bg-green-50',
      social_facility: 'border-l-4 border-purple-500 bg-purple-50',
    };
    return colorMap[amenity] || 'border-l-4 border-blue-500 bg-blue-50';
  };

  const handleDirectionClick = (lat, lon) => {
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(gmapsUrl, '_blank');
  };

  return (
    <>
      {/* Add custom CSS to fix Leaflet z-index issues */}
      <style>{`
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 10 !important;
        }
        .leaflet-top, .leaflet-bottom {
          z-index: 10 !important;
        }
        .map-sidebar {
          z-index: 1000 !important;
        }
        .map-header {
          z-index: 1001 !important;
        }
      `}</style>

      <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-0rem)] bg-gray-50 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <div className="map-header bg-white shadow-lg border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Sustainability Centers</h1>
                <p className="text-xs md:text-sm text-gray-600 truncate max-w-[200px] md:max-w-none">
                  {locationQuery ? `Near ${locationQuery}` : 'Showing nearby centers'}
                </p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu size={20} className="text-gray-600" />
            </button>

            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex gap-2 items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Enter city name..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="md:hidden mt-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-10 pr-16 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                Go
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Filters Bar */}
        <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-4 relative z-50">
          <div className="flex items-center gap-4">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter Centers:</span>
            <div className="flex gap-3">
              {filterCounts.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedFilter === filter.id
                      ? `${filter.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 relative z-50">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {filterCounts.find(f => f.id === selectedFilter)?.label} ({filteredResults.length})
              </span>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="mt-2 grid grid-cols-1 gap-2">
              {filterCounts.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    setShowFilters(false);
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    selectedFilter === filter.id
                      ? `${filter.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{filter.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 relative">
          {/* Desktop Sidebar - Fixed positioning with proper z-index */}
          <div className="map-sidebar hidden md:block absolute left-0 top-0 w-96 h-full bg-white shadow-xl border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Centers Found ({filteredResults.length})
              </h3>
            </div>
            
            <div className="overflow-y-auto h-full pb-4">
              {filteredResults.map((place, index) => (
                <div
                  key={index}
                  className={`p-4 border-b border-gray-100 ${getAmenityColor(place.tags?.amenity)} hover:bg-opacity-80 transition-colors cursor-pointer`}
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getAmenityIcon(place.tags?.amenity)}</span>
                        <h4 className="text-sm font-semibold text-gray-800">
                          {place.tags?.name || "Unnamed Center"}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Lat: {place.lat.toFixed(4)}, Lon: {place.lon.toFixed(4)}
                      </p>
                      {place.tags?.phone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                          <Phone size={12} />
                          {place.tags.phone}
                        </p>
                      )}
                      {place.tags?.website && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Globe size={12} />
                          <a href={place.tags.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Website
                          </a>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectionClick(place.lat, place.lon);
                      }}
                      className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Navigation size={12} />
                      Directions
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredResults.length === 0 && !loading && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-500 font-medium">No centers found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Container - Adjusted for desktop sidebar */}
          <div className="absolute inset-0 md:left-96">
            {center && (
              <MapContainer 
                center={center} 
                zoom={13} 
                className="w-full h-full"
                style={{ zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredResults.map((place, i) => (
                  <Marker key={i} position={[place.lat, place.lon]} icon={customIcon}>
                    <Tooltip direction="top" offset={[0, -20]} opacity={0.9} permanent>
                      <div className="text-center">
                        <div className="text-lg mb-1">{getAmenityIcon(place.tags?.amenity)}</div>
                        <div className="font-medium text-xs">{place.tags?.name || "Unnamed Location"}</div>
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                <p className="text-gray-600 font-medium">Loading centers...</p>
              </div>
            </div>
          )}

          {/* Mobile Sidebar/Bottom Sheet */}
          <div className={`md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 z-50 ${
            showSidebar ? 'translate-y-0' : 'translate-y-full'
          }`} style={{ height: '70vh' }}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Centers ({filteredResults.length})
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ height: 'calc(70vh - 80px)' }}>
              {filteredResults.map((place, index) => (
                <div
                  key={index}
                  className={`p-4 border-b border-gray-100 ${getAmenityColor(place.tags?.amenity)} hover:bg-opacity-80 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getAmenityIcon(place.tags?.amenity)}</span>
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {place.tags?.name || "Unnamed Center"}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Lat: {place.lat.toFixed(4)}, Lon: {place.lon.toFixed(4)}
                      </p>
                      {place.tags?.phone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Phone size={12} />
                          {place.tags.phone}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDirectionClick(place.lat, place.lon)}
                      className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Navigation size={12} />
                      Directions
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredResults.length === 0 && !loading && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-500 font-medium">No centers found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile FAB for showing list */}
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden fixed bottom-6 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          >
            <div className="flex items-center gap-2">
              <Layers size={20} />
              <span className="text-sm font-medium">{filteredResults.length}</span>
            </div>
          </button>
        </div>

        {/* Mobile Sidebar Backdrop */}
        {showSidebar && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </>
  );
};

export default OSMMap;