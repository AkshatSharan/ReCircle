import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Navigation, Filter, Search, Loader2, ArrowLeft, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const filtersConfig = [
  { id: 'all', label: 'All Centers', color: 'bg-blue-500' },
  { id: 'recycling', label: 'Recycling', color: 'bg-green-500' },
  { id: 'social_facility', label: 'Donation', color: 'bg-purple-500' },
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

  const getAmenityIcon = (amenity) => amenity === 'recycling' ? '♻️' : amenity === 'social_facility' ? '🏠' : '📍';

  const getAmenityColor = (amenity) => {
    const colorMap = {
      recycling: 'border-l-4 border-green-500 bg-green-50 hover:bg-green-100',
      social_facility: 'border-l-4 border-purple-500 bg-purple-50 hover:bg-purple-100',
    };
    return colorMap[amenity] || 'border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100';
  };

  const handleDirectionClick = (lat, lon) => {
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(gmapsUrl, '_blank');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sustainability Centers</h1>
              <p className="text-sm text-gray-600">{locationQuery ? `Near ${locationQuery}` : 'Showing nearby centers'}</p>
            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city name..."
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Search</button>
          </form>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4">
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
                <span>{filter.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>{filter.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 relative bg-white overflow-y-auto">
          {filteredResults.map((place, index) => (
            <div
              key={index}
              className={`p-4 border-b cursor-pointer ${getAmenityColor(place.tags?.amenity)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{place.tags?.name || "Unnamed Center"}</h4>
                  <p className="text-xs text-gray-600 mt-1">Lat: {place.lat}, Lon: {place.lon}</p>
                </div>
                <button
                  onClick={() => handleDirectionClick(place.lat, place.lon)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/2">
          {center && (
            <MapContainer center={center} zoom={13} className="w-full h-full">
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
      </div>
    </div>
  );
};

export default OSMMap;
