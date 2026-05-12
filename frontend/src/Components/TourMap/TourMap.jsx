import React, { useEffect, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./TourMap.css";

import { motion } from "framer-motion";
import { geocodeLocation } from "../../utils/geocodeLocation";

const TourMap = ({ city, title }) => {
  const mapKey = import.meta.env.VITE_MAPTILER_KEY;

  const [viewState, setViewState] = useState({
    longitude: 77.209,
    latitude: 28.6139,
    zoom: 10,
  });

  const [popupInfo, setPopupInfo] = useState(true);
  const [locationName, setLocationName] = useState(city || "");

  useEffect(() => {
    const loadLocation = async () => {
      if (!city) return;

      try {
        const location = await geocodeLocation(city);

        setViewState({
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 11,
        });

        setLocationName(location.name);
      } catch (err) {
        console.log("Map location error:", err);
      }
    };

    loadLocation();
  }, [city]);

  if (!mapKey) {
    return (
      <div className="tour-map-wrapper">
        <div className="tour-map-header">
          <h4>Map API Key Missing</h4>
          <p>Add VITE_MAPTILER_KEY in frontend/.env and restart Vite.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="tour-map-wrapper"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="tour-map-header">
        <h4>Explore Destination</h4>
        <p>{locationName || city}</p>
      </div>

      <div style={{ width: "100%", height: "500px" }}>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${mapKey}`}
        >
          <NavigationControl position="top-right" />

          <Marker
            longitude={viewState.longitude}
            latitude={viewState.latitude}
            anchor="bottom"
          >
            <div className="map-marker" onClick={() => setPopupInfo(true)}>
              📍
            </div>
          </Marker>

          {popupInfo && (
            <Popup
              longitude={viewState.longitude}
              latitude={viewState.latitude}
              anchor="top"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopupInfo(false)}
            >
              <div className="map-popup">
                <h5>{title}</h5>
                <p>{locationName || city}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </motion.div>
  );
};

export default TourMap;