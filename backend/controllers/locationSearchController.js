import axios from "axios";

export const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    if (!process.env.MAPTILER_KEY) {
      return res.status(500).json({
        success: false,
        message: "MAPTILER_KEY missing in backend environment variables",
      });
    }

    const response = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`,
      {
        params: {
          key: process.env.MAPTILER_KEY,
          limit: 10,
          language: "en",
        },
      }
    );

    const results =
      response.data?.features?.map((place) => {
        const context = place.context || [];

        const country =
          context.find((item) => item.id?.startsWith("country"))?.text ||
          place.properties?.country ||
          "";

        const state =
          context.find(
            (item) =>
              item.id?.startsWith("region") ||
              item.id?.startsWith("province") ||
              item.id?.startsWith("state")
          )?.text || "";

        return {
          id: place.id,
          destination: place.text_en || place.text || query,
          country,
          state,
          fullName: place.place_name_en || place.place_name || place.text,
        };
      }) || [];

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("LOCATION SEARCH ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Location search failed",
      error: error.response?.data?.message || error.message,
    });
  }
};