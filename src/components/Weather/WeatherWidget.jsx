import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('London');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Get coordinates from Open-Meteo Geocoding API
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }
      
      const { latitude, longitude, name, country_code } = geoData.results[0];
      
      // 2. Get weather from Open-Meteo Forecast API
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,visibility`);
      const weatherData = await weatherRes.json();
      
      const current = weatherData.current_weather;
      
      // Map WMO code to icon and description
      const wmoCode = current.weathercode;
      let icon = 'sunny';
      let description = 'Clear sky';
      
      if ([1, 2, 3, 45, 48].includes(wmoCode)) { icon = 'cloudy'; description = 'Cloudy'; }
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(wmoCode)) { icon = 'rainy'; description = 'Rainy'; }
      if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) { icon = 'snowy'; description = 'Snowy'; }

      // Get current hour index for hourly data
      const currentHourStr = current.time; 
      const timeIndex = weatherData.hourly.time.indexOf(currentHourStr);
      const safeIndex = timeIndex !== -1 ? timeIndex : 0;

      const humidity = weatherData.hourly.relativehumidity_2m[safeIndex] || 60;
      const visibility = weatherData.hourly.visibility ? Math.round(weatherData.hourly.visibility[safeIndex] / 1000) : 10;

      setWeather({
        city: name,
        country: country_code || '',
        temperature: Math.round(current.temperature),
        description: description,
        humidity: humidity,
        windSpeed: Math.round(current.windspeed),
        visibility: visibility,
        icon: icon
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(searchCity);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchCity(city.trim());
      fetchWeather(city.trim());
    }
  };

  const getWeatherIcon = (iconType) => {
    switch (iconType) {
      case 'sunny':
        return <Sun size={48} color="#FFA500" />;
      case 'cloudy':
        return <Cloud size={48} color="#87CEEB" />;
      case 'rainy':
        return <CloudRain size={48} color="#4682B4" />;
      case 'snowy':
        return <CloudSnow size={48} color="#B0C4DE" />;
      default:
        return <Cloud size={48} color="#87CEEB" />;
    }
  };

  return (
    <div className="weather-widget fade-in">
      <div className="weather-header">
        <h1 className="page-title">Weather Information</h1>
        <p className="page-subtitle">Check current weather conditions for your destinations</p>
      </div>

      <div className="weather-search">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {weather && !loading && (
        <div className="weather-card">
          <div className="weather-main">
            <div className="weather-icon">
              {getWeatherIcon(weather.icon)}
            </div>
            <div className="weather-info">
              <h2 className="city-name">{weather.city}</h2>
              <div className="temperature">{weather.temperature}°C</div>
              <div className="description">{weather.description}</div>
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <Thermometer size={20} />
              <div>
                <span className="detail-label">Temperature</span>
                <span className="detail-value">{weather.temperature}°C</span>
              </div>
            </div>

            <div className="detail-item">
              <Droplets size={20} />
              <div>
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
            </div>

            <div className="detail-item">
              <Wind size={20} />
              <div>
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} km/h</span>
              </div>
            </div>

            <div className="detail-item">
              <Eye size={20} />
              <div>
                <span className="detail-label">Visibility</span>
                <span className="detail-value">{weather.visibility} km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      )}

      <div className="weather-tips">
        <h3>Weather Planning Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Check Before You Pack</h4>
            <p>Always check the weather forecast for your destination before packing to ensure you bring appropriate clothing.</p>
          </div>
          <div className="tip-card">
            <h4>Layer Your Clothing</h4>
            <p>Layering allows you to adjust to changing weather conditions throughout the day.</p>
          </div>
          <div className="tip-card">
            <h4>Plan Indoor Alternatives</h4>
            <p>Have backup indoor activities planned in case of unexpected weather changes.</p>
          </div>
          <div className="tip-card">
            <h4>Stay Hydrated</h4>
            <p>Weather conditions can affect hydration needs - drink plenty of water regardless of temperature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;