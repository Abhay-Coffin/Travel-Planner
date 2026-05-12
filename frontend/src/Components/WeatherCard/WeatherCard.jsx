import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { geocodeLocation } from "../../utils/geocodeLocation";

import "./WeatherCard.css";

const WeatherCard = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState(city || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeatherIcon = (code) => {
    if ([0, 1].includes(code)) return "ri-sun-line";
    if ([2, 3].includes(code)) return "ri-cloudy-line";
    if ([45, 48].includes(code)) return "ri-mist-line";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return "ri-rainy-line";
    }
    if ([71, 73, 75, 85, 86].includes(code)) return "ri-snowy-line";
    if ([95, 96, 99].includes(code)) return "ri-thunderstorms-line";

    return "ri-cloud-line";
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      setLoading(true);
      setError("");
      setWeather(null);

      try {
        const location = await geocodeLocation(city);

        setLocationName(location.name);

        const weatherRes = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        setWeather(weatherRes.data);
      } catch (err) {
        setError("Weather location not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (!city) return null;

  if (loading) {
    return (
      <div className="weather__card">
        <p>Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather__card">
        <p>{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const current = weather.current;
  const daily = weather.daily;

  return (
    <motion.div
      className="weather__card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <div className="weather__top">
        <div>
          <h4>Live Weather</h4>
          <p>{locationName}</p>
        </div>

        <i className={getWeatherIcon(current.weather_code)}></i>
      </div>

      <h2>{Math.round(current.temperature_2m)}°C</h2>

      <div className="weather__grid">
        <div>
          <span>Humidity</span>
          <strong>{current.relative_humidity_2m}%</strong>
        </div>

        <div>
          <span>Wind</span>
          <strong>{current.wind_speed_10m} km/h</strong>
        </div>

        <div>
          <span>Max</span>
          <strong>{Math.round(daily.temperature_2m_max[0])}°C</strong>
        </div>

        <div>
          <span>Min</span>
          <strong>{Math.round(daily.temperature_2m_min[0])}°C</strong>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;