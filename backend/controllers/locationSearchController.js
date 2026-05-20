import axios from "axios";

export const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    if (!process.env.MAPTILER_KEY) {
      return res.status(500).json({
        success: false,
        message: "MapTiler API key missing",
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
      response.data?.features?.map((place) => ({
        id: place.id,
        destination: place.text_en || place.text || query,
        country: place.context?.find((c) => c.id?.includes("country"))?.text || "",
        state:
          place.context?.find(
            (c) =>
              c.id?.includes("region") ||
              c.id?.includes("province") ||
              c.id?.includes("state")
          )?.text || "",
        fullName: place.place_name_en || place.place_name,
      })) || [];

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Location search failed",
      error: error.message,
    });
  }
};