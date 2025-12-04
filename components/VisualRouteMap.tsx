import React, { useState, useEffect, useRef } from 'react';
import { Map, Plane, Car, Train, ArrowRight, MapPin, Info, Ship, Bus, Loader2, Navigation, Clock, MapPinned, Locate, Bike, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { getAccurateDestinationImage } from '../data/destinationImageMap';

// Google Maps types declaration
declare global {
  interface Window {
    google: any;
  }
}

const GEMINI_API_KEY = (import.meta.env.VITE_API_KEY as string) || '';
const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface Waypoint {
  name: string;
  type: 'city' | 'landmark' | 'rest_area' | 'border';
  description: string;
  estimated_duration_from_start: string;
  fun_fact?: string;
}

interface RouteData {
  waypoints: Waypoint[];
  total_duration: string;
  total_distance: string;
  recommended_transport: string;
}

type TransportType = 'plane' | 'train' | 'car' | 'bus' | 'ship' | 'motorcycle';

const VisualRouteMap: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [transport, setTransport] = useState<TransportType>('car');
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routePolylineRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const transportOptions = [
    { id: 'plane' as TransportType, icon: Plane, label: 'Pesawat', color: 'bg-blue-500' },
    { id: 'train' as TransportType, icon: Train, label: 'Kereta', color: 'bg-purple-500' },
    { id: 'car' as TransportType, icon: Car, label: 'Mobil', color: 'bg-emerald-500' },
    { id: 'motorcycle' as TransportType, icon: Bike, label: 'Motor', color: 'bg-red-500' },
    { id: 'bus' as TransportType, icon: Bus, label: 'Bus', color: 'bg-orange-500' },
    { id: 'ship' as TransportType, icon: Ship, label: 'Kapal', color: 'bg-cyan-500' },
  ];

  // Load Google Maps Script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not found. Real-time tracking disabled.');
      return;
    }

    // If already loaded, mark as ready
    if (window.google && window.google.maps) {
      setIsMapScriptLoaded(true);
      return;
    }

    // Avoid injecting duplicate script tags
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        setIsMapScriptLoaded(true);
      } else {
        existingScript.addEventListener('load', () => setIsMapScriptLoaded(true));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      setIsMapScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Google Maps script', error);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || !isMapScriptLoaded || !window.google || googleMapRef.current) return;

    // Center on Indonesia
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: -2.5489, lng: 118.0149 }, // Indonesia center
      zoom: 5,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
    });
  }, [isMapScriptLoaded]);

  // Get User Location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung browser kamu');
      return;
    }

    setIsTrackingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Update map center
        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat: latitude, lng: longitude });
          googleMapRef.current.setZoom(12);
        }

        // Add user marker
        if (window.google && googleMapRef.current) {
          if (userMarkerRef.current) {
            userMarkerRef.current.setMap(null);
          }

          userMarkerRef.current = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: googleMapRef.current,
            title: 'Lokasi Kamu',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#10B981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            animation: window.google.maps.Animation.BOUNCE,
          });

          setTimeout(() => {
            if (userMarkerRef.current) {
              userMarkerRef.current.setAnimation(null);
            }
          }, 2000);
        }

        setIsTrackingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Gagal mendapatkan lokasi. Pastikan GPS/lokasi aktif!');
        setIsTrackingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const generateRoute = async () => {
    setIsLoading(true);
    setRouteData(null);
    setCurrentWaypoint(0);

    try {
      const prompt = `Generate a travel route from ${from} to ${to} in Indonesia using ${transport}.

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "waypoints": [
    {
      "name": "City/Landmark name",
      "type": "city",
      "description": "Very brief 1-sentence description",
      "estimated_duration_from_start": "2 hours",
      "fun_fact": "Quick interesting fact (optional)"
    }
  ],
  "total_duration": "12 hours",
  "total_distance": "850 km",
  "recommended_transport": "${transport}"
}

Rules:
- Include 4-8 waypoints maximum (notable cities, landmarks, or rest areas along the route)
- Each waypoint must have realistic duration from start
- Keep descriptions under 15 words
- Focus on famous/unique places
- Type can be: city, landmark, rest_area, or border
- Make it realistic for Indonesian geography`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error('No response from AI');

      const jsonStartIndex = text.indexOf('{');
      const jsonEndIndex = text.lastIndexOf('}');
      
      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error('Invalid JSON format');
      }

      let jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
      jsonString = jsonString
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ');

      const data: RouteData = JSON.parse(jsonString);
      setRouteData(data);

      // Auto-animate waypoints
      let index = 0;
      const interval = setInterval(() => {
        setCurrentWaypoint(prev => {
          if (prev >= data.waypoints.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);

    } catch (error) {
      console.error('Route generation error:', error);
      alert('Gagal generate rute. Coba lagi!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    generateRoute();
  };

  const TransportIcon = transportOptions.find(t => t.id === transport)?.icon || Car;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Map className="text-emerald-600 dark:text-emerald-400" /> Visual Route Planner
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
            Simulasikan perjalananmu antar kota. Lihat tempat-tempat menarik yang akan kamu lewati, estimasi waktu, dan informasi berguna di sepanjang rute.
          </p>
        </div>
        {GOOGLE_MAPS_API_KEY && (
          <button
            onClick={getUserLocation}
            disabled={isTrackingLocation}
            className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            {isTrackingLocation ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Mencari...
              </>
            ) : (
              <>
                <Locate size={18} />
                Lokasi Saya
              </>
            )}
          </button>
        )}
      </div>

      {/* Google Maps Display */}
      {GOOGLE_MAPS_API_KEY ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 shadow-sm">
          <div 
            ref={mapRef} 
            className="w-full h-96"
            style={{ minHeight: '400px' }}
          />
          {userLocation && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-700">
              <p className="text-sm text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
                <MapPin size={16} />
                Lokasi kamu: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 mb-8">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            ⚠️ <strong>Google Maps API Key tidak ditemukan.</strong> Tambahkan <code className="bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded">VITE_GOOGLE_MAPS_API_KEY</code> di file <code>.env</code> untuk mengaktifkan peta real-time.
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-xs mt-2">
            Lihat <strong>GOOGLE_MAPS_SETUP.md</strong> untuk panduan setup.
          </p>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8 shadow-sm">
        <form onSubmit={handleSimulate} className="space-y-6">
          
          {/* From & To */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MapPinned size={16} className="text-emerald-600" /> Dari Kota
              </label>
              <input 
                type="text" 
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Contoh: Bekasi"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Navigation size={16} className="text-emerald-600" /> Tujuan
              </label>
              <input 
                type="text" 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Contoh: Sidoarjo"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                required
              />
            </div>
          </div>

          {/* Transport Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Pilih Transportasi</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {transportOptions.map(({ id, icon: Icon, label, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTransport(id)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    transport === id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || !from || !to}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Menghasilkan Rute...
              </>
            ) : (
              <>
                <Map size={20} />
                Simulasikan Rute
              </>
            )}
          </button>
        </form>
      </div>

      {/* Route Visualization */}
      {routeData && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          
          {/* Route Summary */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {from} → {to}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {routeData.waypoints.length} titik perjalanan
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Jarak</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{routeData.total_distance}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Est. Waktu</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{routeData.total_duration}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-600"></div>

            {/* Waypoints */}
            <div className="space-y-8">
              {routeData.waypoints.map((waypoint, index) => {
                const isActive = index <= currentWaypoint;
                const isCurrent = index === currentWaypoint;

                return (
                  <div 
                    key={index}
                    className={`relative pl-20 transition-all duration-500 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'
                    }`}
                  >
                    {/* Marker */}
                    <div className={`absolute left-4 top-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/50 animate-pulse'
                        : isActive
                        ? 'bg-emerald-600 scale-100'
                        : 'bg-slate-300 dark:bg-slate-600 scale-90'
                    }`}>
                      {isCurrent ? (
                        <TransportIcon size={18} className="text-white" />
                      ) : (
                        <MapPin size={16} className="text-white" />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`bg-slate-50 dark:bg-slate-900 rounded-xl border-2 p-6 transition-all ${
                      isCurrent
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className="flex items-start gap-4">
                        
                        {/* Image with Maps Button */}
                        <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 relative group">
                          <img 
                            src={getAccurateDestinationImage(waypoint.name, waypoint.type === 'landmark' ? 'Sejarah' : waypoint.type === 'city' ? 'Budaya' : 'Alam')}
                            alt={waypoint.name}
                            className="w-full h-full object-cover transition-all group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300';
                            }}
                          />
                          {/* Google Maps Button Overlay */}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(waypoint.name + ', Indonesia')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                            title="Buka di Google Maps"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <MapPinned size={24} className="text-white" />
                              <span className="text-white text-xs font-semibold">Open Map</span>
                            </div>
                          </a>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {waypoint.name}
                              </h4>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                waypoint.type === 'city' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                waypoint.type === 'landmark' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                waypoint.type === 'rest_area' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}>
                                {waypoint.type.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Clock size={14} />
                              <span className="text-sm font-semibold">{waypoint.estimated_duration_from_start}</span>
                            </div>
                          </div>

                          <p className="text-slate-600 dark:text-slate-400 mb-3">
                            {waypoint.description}
                          </p>

                          {waypoint.fun_fact && (
                            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                              <Info size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                {waypoint.fun_fact}
                              </p>
                            </div>
                          )}

                          {isCurrent && (
                            <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                              <MapPin size={16} />
                              <span className="text-sm">Anda sedang di sini</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              💡 <strong>Tips:</strong> Rute ini di-generate oleh AI berdasarkan data geografis Indonesia. 
              Waktu perjalanan bisa berbeda tergantung kondisi lalu lintas dan cuaca.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default VisualRouteMap;
