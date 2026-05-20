import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./AIMap.css";

const AIMap = ({ destination }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(false);

  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  useEffect(() => {
    if (!maptilerKey) {
      console.error("VITE_MAPTILER_KEY is missing in frontend .env");
      return;
    }

    maptilersdk.config.apiKey = maptilerKey;

    if (!map.current && mapContainer.current) {
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [78.9629, 20.5937],
        zoom: 4,
      });
    }

    return () => {
      clearMarkers();

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [maptilerKey]);

  useEffect(() => {
    const loadDestination = async () => {
      if (!destination || !map.current || !maptilerKey) return;

      try {
        setLoading(true);
        clearMarkers();

        const geoRes = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(
            destination
          )}.json?key=${maptilerKey}`
        );

        if (!geoRes.ok) {
          throw new Error("Failed to geocode destination");
        }

        const geoData = await geoRes.json();

        if (!geoData.features || geoData.features.length === 0) {
          console.warn("No location found for:", destination);
          return;
        }

        const [lng, lat] = geoData.features[0].center;

        map.current.flyTo({
          center: [lng, lat],
          zoom: 13,
          essential: true,
        });

        const destinationMarker = new maptilersdk.Marker({ color: "#2563eb" })
          .setLngLat([lng, lat])
          .setPopup(
            new maptilersdk.Popup().setHTML(
              `<strong>${destination}</strong><br/>Selected destination`
            )
          )
          .addTo(map.current);

        markersRef.current.push(destinationMarker);

        try {
          const overpassQuery = `
            [out:json][timeout:12];
            (
              node["tourism"](around:5000,${lat},${lng});
              node["amenity"="restaurant"](around:5000,${lat},${lng});
              node["amenity"="cafe"](around:5000,${lat},${lng});
              node["historic"](around:5000,${lat},${lng});
              node["leisure"](around:5000,${lat},${lng});
            );
            out center 20;
          `;

          const placesRes = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
              method: "POST",
              body: overpassQuery,
            }
          );

          if (!placesRes.ok) {
            throw new Error("Nearby places API failed");
          }

          const placesData = await placesRes.json();

          const places =
            placesData.elements
              ?.filter((item) => item.lat && item.lon && item.tags?.name)
              .slice(0, 10) || [];

          places.forEach((place) => {
            const popupText =
              place.tags.tourism ||
              place.tags.amenity ||
              place.tags.historic ||
              place.tags.leisure ||
              "Nearby place";

            const marker = new maptilersdk.Marker({ color: "#ef4444" })
              .setLngLat([place.lon, place.lat])
              .setPopup(
                new maptilersdk.Popup().setHTML(
                  `<strong>${place.tags.name}</strong><br/>${popupText}`
                )
              )
              .addTo(map.current);

            markersRef.current.push(marker);
          });
        } catch (placesError) {
          console.warn("Nearby places could not be loaded:", placesError);
        }
      } catch (error) {
        console.error("MapTiler map loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [destination, maptilerKey]);

  return (
    <div className="ai__map-section">
      <div className="ai__map-header">
        <span className="ai__badge">Interactive Map</span>
        <h4>{destination || "Destination"} Map Preview</h4>
        <p>
          {loading
            ? "Loading live nearby places..."
            : "Explore live nearby attractions, cafes, restaurants, and landmarks using MapTiler."}
        </p>
      </div>

      <div ref={mapContainer} className="ai__map" />
    </div>
  );
};

export default AIMap;