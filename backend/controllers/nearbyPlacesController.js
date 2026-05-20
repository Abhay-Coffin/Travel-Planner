import axios from "axios";

export const getNearbyPlaces = async (req, res) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required",
      });
    }

    if (!process.env.MAPTILER_KEY) {
      return res.status(500).json({
        success: false,
        message: "MAPTILER_KEY missing",
      });
    }

    const geoRes = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(
        destination
      )}.json`,
      {
        params: {
          key: process.env.MAPTILER_KEY,
          limit: 1,
          language: "en",
        },
      }
    );

    const feature = geoRes.data?.features?.[0];

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const [lng, lat] = feature.center;

    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["tourism"](around:6000,${lat},${lng});
        node["historic"](around:6000,${lat},${lng});
        node["amenity"="restaurant"](around:6000,${lat},${lng});
        node["amenity"="cafe"](around:6000,${lat},${lng});
        node["leisure"](around:6000,${lat},${lng});
      );
      out center 30;
    `;

    const placesRes = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    const places =
      placesRes.data?.elements
        ?.filter((item) => item.tags?.name && item.lat && item.lon)
        .slice(0, 12)
        .map((item) => ({
          id: item.id,
          name: item.tags.name,
          type:
            item.tags.tourism ||
            item.tags.historic ||
            item.tags.amenity ||
            item.tags.leisure ||
            "Place",
          lat: item.lat,
          lng: item.lon,
          description: `Popular ${item.tags.tourism || item.tags.amenity || item.tags.historic || item.tags.leisure || "place"} near ${destination}`,
        })) || [];

    res.status(200).json({
      success: true,
      data: {
        destination,
        center: { lat, lng },
        places,
      },
    });
  } catch (error) {
    console.error("NEARBY PLACES ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby places",
      error: error.message,
    });
  }
};