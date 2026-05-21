import axios from "axios";

export const getNearbyPlaces = async (req, res) => {
  try {
    const lat = Number(req.query.lat || req.query.latitude);
    const lng = Number(req.query.lng || req.query.longitude);

    console.log("NEARBY QUERY:", req.query);
    console.log("LAT:", lat);
    console.log("LNG:", lng);

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
    }

    const overpassQuery = `
[out:json][timeout:25];
(
  node["tourism"](around:12000,${lat},${lng});
  node["amenity"="restaurant"](around:12000,${lat},${lng});
  node["amenity"="cafe"](around:12000,${lat},${lng});
  node["historic"](around:12000,${lat},${lng});
  node["leisure"](around:12000,${lat},${lng});
  way["tourism"](around:12000,${lat},${lng});
  way["amenity"="restaurant"](around:12000,${lat},${lng});
  way["amenity"="cafe"](around:12000,${lat},${lng});
  way["historic"](around:12000,${lat},${lng});
  way["leisure"](around:12000,${lat},${lng});
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
          headers: {
            "Content-Type": "text/plain",
          },
          timeout: 30000,
        });

        placesData = response.data;
        break;
      } catch (error) {
        console.log(`Overpass failed: ${url}`, error.message);
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
            description: `${item.tags.name} is a nearby ${
              item.tags.tourism ||
              item.tags.historic ||
              item.tags.amenity ||
              item.tags.leisure ||
              "place"
            }.`,
          };
        })
        .filter(Boolean)
        .slice(0, 12) || [];

    return res.status(200).json({
      success: true,
      data: places,
      center: {
        lat,
        lng,
      },
      message: places.length
        ? "Nearby places fetched successfully"
        : "No nearby places found",
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