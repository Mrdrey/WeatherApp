import React, { useState } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);
      setForecast([]);

      // Convert city name to latitude & longitude
      const geocode = await axios.get(`https://geocode.maps.co/search?q=${city}`);

      if (geocode.data.length === 0) {
        setError("City not found!");
        return;
      }

      const { lat, lon } = geocode.data[0];

      // Fetch current weather & 5-day forecast
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min`
      );

      setWeather(weatherRes.data.current_weather);
      setForecast(weatherRes.data.daily);
    } catch (err) {
      setError("Error fetching weather!");
    }
  };

  return (
    <div className="weather-container">
      <h2>🌦️ Weather App</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h3>🌡️ Temperature: {weather.temperature}°C</h3>
          <p>💨 Wind Speed: {weather.windspeed} km/h</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>📅 5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.temperature_2m_max.map((temp, index) => (
              <div className="forecast-item" key={index}>
                <p>Day {index + 1}</p>
                <p>🌡️ {temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
