import axios from "axios";

const CACHE_KEY = "geoLocationCache";

const getCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
};

const saveCache = (cache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    console.warn("Unable to save geocode cache");
  }
};

const cleanLocation = (location = "") => {
  return location.trim().replace(/\s+/g, " ");
};

export const geocodeLocation = async (locationName) => {
  const query = cleanLocation(locationName);

  if (!query || query.length < 2) {
    throw new Error("Location is required");
  }

  const cache = getCache();
  const cacheKey = query.toLowerCase();

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: query,
      format: "json",
      limit: 1,
      addressdetails: 1,
    },
    headers: {
      "Accept-Language": "en",
    },
  });

  const result = response.data?.[0];

  if (!result) {
    throw new Error("Location not found");
  }

  const locationData = {
    name: result.display_name || query,
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };

  if (
    Number.isNaN(locationData.latitude) ||
    Number.isNaN(locationData.longitude)
  ) {
    throw new Error("Invalid location coordinates");
  }

  saveCache({
    ...cache,
    [cacheKey]: locationData,
  });

  return locationData;
};