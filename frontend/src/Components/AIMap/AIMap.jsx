import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./AIMap.css";

const destinationMapData = {
  manali: {
    center: [32.2396, 77.1887],
    zoom: 12,
    places: [
      {
        name: "Hadimba Devi Temple",
        position: [32.2483, 77.1809],
        description: "Famous temple surrounded by cedar forest.",
      },
      {
        name: "Solang Valley",
        position: [32.316, 77.157],
        description: "Adventure sports and scenic mountain views.",
      },
      {
        name: "Old Manali",
        position: [32.2539, 77.1773],
        description: "Cafes, markets, hostels, and riverside walks.",
      },
    ],
  },

  goa: {
    center: [15.2993, 74.124],
    zoom: 9,
    places: [
      {
        name: "Baga Beach",
        position: [15.5553, 73.7517],
        description: "Popular beach for nightlife and water sports.",
      },
      {
        name: "Fort Aguada",
        position: [15.492, 73.773],
        description: "Historic sea-facing fort.",
      },
      {
        name: "Palolem Beach",
        position: [15.0099, 74.0232],
        description: "Peaceful beach with kayaking and cafes.",
      },
    ],
  },

  paris: {
    center: [48.8566, 2.3522],
    zoom: 12,
    places: [
      {
        name: "Eiffel Tower",
        position: [48.8584, 2.2945],
        description: "Iconic Paris landmark.",
      },
      {
        name: "Louvre Museum",
        position: [48.8606, 2.3376],
        description: "World-famous museum and art destination.",
      },
      {
        name: "Montmartre",
        position: [48.8867, 2.3431],
        description: "Charming streets, cafes, and city views.",
      },
    ],
  },
};

const defaultMapData = {
  center: [20.5937, 78.9629],
  zoom: 5,
  places: [
    {
      name: "Destination Area",
      position: [20.5937, 78.9629],
      description: "Map preview for this destination.",
    },
  ],
};

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getMapData = (destination = "") => {
  const value = destination.toLowerCase();

  const matchedKey = Object.keys(destinationMapData).find((key) =>
    value.includes(key)
  );

  return matchedKey ? destinationMapData[matchedKey] : defaultMapData;
};

const AIMap = ({ destination }) => {
  const mapData = getMapData(destination);

  return (
    <div className="ai__map-section">
      <div className="ai__map-header">
        <span className="ai__badge">Interactive Map</span>
        <h4>{destination || "Destination"} Map Preview</h4>
        <p>
          Explore popular attractions and nearby highlights for your trip.
        </p>
      </div>

      <MapContainer
        center={mapData.center}
        zoom={mapData.zoom}
        scrollWheelZoom={false}
        className="ai__map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapData.places.map((place, index) => (
          <Marker
            key={`${place.name}-${index}`}
            position={place.position}
            icon={markerIcon}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AIMap;