import axios from "axios";

export const getCountryCurrency = async (req, res) => {
  try {
    const country = req.query.country?.trim();

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        country
      )}?fields=name,currencies`
    );

    const countryData = response.data?.[0];
    const currencies = countryData?.currencies;

    if (!currencies || typeof currencies !== "object") {
      return res.status(404).json({
        success: false,
        message: "Currency not found for this country",
      });
    }

    const [currencyCode, currencyDetails] = Object.entries(currencies)[0] || [];

    if (!currencyCode) {
      return res.status(404).json({
        success: false,
        message: "Currency not found for this country",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        country: countryData?.name?.common || country,
        currency: {
          code: currencyCode,
          name: currencyDetails?.name || null,
          symbol: currencyDetails?.symbol || null,
        },
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to detect destination currency",
      error: error.message,
    });
  }
};

export const getNearbyPlaces = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

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
out center 30;
`;

    const { data: placesData } = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      {
        headers: {
          "Content-Type": "text/plain",
        },
        timeout: 20000,
      }
    );

    const places =
      placesData.elements
        ?.map((item) => {
          const latitude = item.lat || item.center?.lat;
          const longitude = item.lon || item.center?.lon;

          if (!latitude || !longitude || !item.tags?.name) return null;

          return {
            id: item.id,
            name: item.tags.name,
            type:
              item.tags.tourism ||
              item.tags.amenity ||
              item.tags.historic ||
              item.tags.leisure ||
              "Place",
            description: `${item.tags.name} is a nearby ${
              item.tags.tourism ||
              item.tags.amenity ||
              item.tags.historic ||
              item.tags.leisure ||
              "place"
            }.`,
            lat: latitude,
            lng: longitude,
          };
        })
        .filter(Boolean)
        .slice(0, 12) || [];

    if (!places.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No nearby places found",
      });
    }

    return res.status(200).json({
      success: true,
      data: places,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby places",
      error: error.message,
    });
  }
};