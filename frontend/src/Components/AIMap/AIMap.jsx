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

      map.current.on("error", (e) => {
  console.warn("MapTiler warning:", e?.error || e);
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
          )}.json?key=${maptilerKey}&limit=1&language=en`
        );

        if (!geoRes.ok) {
          throw new Error("Failed to geocode destination");
        }

        const geoData = await geoRes.json();
        const feature = geoData.features?.[0];

        if (!feature?.center?.length) {
          console.warn("No location found for:", destination);
          return;
        }

      const [lng, lat] = feature.center || [];

if (
  typeof lng !== "number" ||
  typeof lat !== "number" ||
  Number.isNaN(lng) ||
  Number.isNaN(lat)
) {
  console.warn("Invalid coordinates:", feature.center);
  return;
}

        if (typeof lng !== "number" || typeof lat !== "number") {
          console.warn("Invalid coordinates:", feature.center);
          return;
        }

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
            ? "Loading destination map..."
            : "Explore your selected destination on MapTiler."}
        </p>
      </div>

      <div ref={mapContainer} className="ai__map" />
    </div>
  );
};

export default AIMap;