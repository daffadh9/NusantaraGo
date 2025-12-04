import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, CloudDrizzle, Droplets, Eye, Thermometer } from 'lucide-react';

interface WeatherTimeWidgetProps {
  city?: string;
}

const WeatherTimeWidget: React.FC<WeatherTimeWidgetProps> = ({ city = 'Jakarta' }) => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Cerah',
    humidity: 75,
    wind: 12,
    icon: 'sun'
  });
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate weather data (in production, fetch from API)
  useEffect(() => {
    const conditions = ['Cerah', 'Berawan', 'Hujan Ringan', 'Berawan Sebagian'];
    const icons = ['sun', 'cloud', 'rain', 'cloudy'];
    const randomIndex = Math.floor(Math.random() * conditions.length);
    
    setWeather({
      temp: Math.floor(Math.random() * 10) + 25, // 25-35°C
      condition: conditions[randomIndex],
      humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
      wind: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      icon: icons[randomIndex]
    });
  }, []);

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case 'sun':
        return (
          <div className="relative">
            <Sun className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-0 w-8 h-8 bg-yellow-400/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
        );
      case 'cloud':
        return (
          <div className="animate-bounce" style={{ animationDuration: '3s' }}>
            <Cloud className="w-8 h-8 text-gray-400" />
          </div>
        );
      case 'rain':
        return (
          <div className="relative">
            <CloudRain className="w-8 h-8 text-blue-400 animate-pulse" />
            <div className="absolute top-6 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        );
      case 'cloudy':
        return (
          <div className="animate-bounce" style={{ animationDuration: '4s' }}>
            <CloudDrizzle className="w-8 h-8 text-gray-500" />
          </div>
        );
      default:
        return <Sun className="w-8 h-8 text-yellow-400 animate-pulse" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 rounded-xl border border-sky-200 dark:border-sky-800 hover:shadow-lg transition-all duration-300 group"
      >
        {/* Weather Icon */}
        <div className="flex-shrink-0">
          {getWeatherIcon()}
        </div>

        {/* Time & Weather Info */}
        <div className="flex flex-col items-start">
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
            {formatTime(time)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span>{weather.temp}°C</span>
            <span>•</span>
            <span>{weather.condition}</span>
          </div>
        </div>

        {/* Expand Indicator */}
        <div className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <Wind className="w-4 h-4" />
        </div>
      </button>

      {/* Detailed Weather Popup */}
      {showDetail && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 animate-in slide-in-from-top-2 duration-300">
          {/* Close Button */}
          <button
            onClick={() => setShowDetail(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>

          {/* Date */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {formatDate(time)}
          </div>

          {/* Main Weather */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {weather.temp}°C
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {weather.condition}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                📍 {city}
              </div>
            </div>
            <div className="text-6xl">
              {getWeatherIcon()}
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Kelembaban</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {weather.humidity}%
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Wind className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Angin</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {weather.wind} <span className="text-sm">km/h</span>
              </div>
            </div>
          </div>

          {/* Forecast (Simulated) */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">
              Prakiraan Hari Ini
            </div>
            <div className="flex justify-between">
              {['09:00', '12:00', '15:00', '18:00'].map((t, i) => (
                <div key={t} className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">{t}</div>
                  <Sun className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {27 + i}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherTimeWidget;
