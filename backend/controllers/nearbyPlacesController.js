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
      `https://api.maptiler.com/geocoding/${encodeURIComponent(destination)}.json`,
      {
        params: {
          key: process.env.MAPTILER_KEY,
          limit: 1,
          language: "en",
        },
      }
    );

    const feature = geoRes.data?.features?.[0];

    if (!feature?.center) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const [lng, lat] = feature.center;

    const overpassQuery = `
      [out:json][timeout:25];
      (
        nwr["tourism"](around:10000,${lat},${lng});
        nwr["historic"](around:10000,${lat},${lng});
        nwr["amenity"="restaurant"](around:10000,${lat},${lng});
        nwr["amenity"="cafe"](around:10000,${lat},${lng});
        nwr["leisure"](around:10000,${lat},${lng});
      );
      out center 40;
    `;

    const overpassUrls = [
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass-api.de/api/interpreter",
      "https://overpass.openstreetmap.ru/api/interpreter",
    ];

    let placesData = null;

    for (const url of overpassUrls) {
      try {
        const response = await axios.post(url, overpassQuery, {
          headers: { "Content-Type": "text/plain" },
          timeout: 30000,
        });

        placesData = response.data;
        break;
      } catch (error) {
        console.log(`Overpass failed: ${url}`);
      }
    }

    const places =
      placesData?.elements
        ?.map((item) => {
          const placeLat = item.lat || item.center?.lat;
          const placeLng = item.lon || item.center?.lon;

          if (!item.tags?.name || !placeLat || !placeLng) return null;

          return {
            id: item.id,
            name: item.tags.name,
            type:
              item.tags.tourism ||
              item.tags.historic ||
              item.tags.amenity ||
              item.tags.leisure ||
              "Place",
            lat: placeLat,
            lng: placeLng,
            description: `Popular place near ${destination}`,
          };
        })
        .filter(Boolean)
        .slice(0, 12) || [];

    return res.status(200).json({
      success: true,
      data: {
        destination,
        center: { lat, lng },
        places,
      },
    });
  } catch (error) {
    console.error("NEARBY PLACES ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby places",
      error: error.message,
    });
  }
};