import axios from "axios";

export const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!process.env.WEATHER_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Weather API key missing",
      });
    }

    const response = await axios.get(
      "https://api.weatherapi.com/v1/forecast.json",
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: city,
          days: 3,
          aqi: "no",
          alerts: "no",
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};