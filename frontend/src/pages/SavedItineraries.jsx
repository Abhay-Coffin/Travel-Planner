import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";

import Newsletter from "../Shared/Newsletter";
import BackButton from "../Components/common/BackButton";

import "../styles/SavedItineraries.css";

const destinationImages = {
  manali:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  goa:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  london:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
  default:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
};

const getTripImage = (destination = "") => {
  const key = destination.toLowerCase();

  if (key.includes("manali")) return destinationImages.manali;
  if (key.includes("paris")) return destinationImages.paris;
  if (key.includes("goa")) return destinationImages.goa;
  if (key.includes("london")) return destinationImages.london;

  return destinationImages.default;
};

const SavedItineraries = () => {
  const [savedTrips, setSavedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("savedItineraries")) || [];
    setSavedTrips(trips);

    if (trips.length > 0) {
      setSelectedTrip(trips[0]);
    }
  }, []);

  const deleteTrip = (tripToDelete) => {
    const updatedTrips = savedTrips.filter((trip) => trip !== tripToDelete);

    setSavedTrips(updatedTrips);
    localStorage.setItem("savedItineraries", JSON.stringify(updatedTrips));

    if (selectedTrip === tripToDelete) {
      setSelectedTrip(updatedTrips[0] || null);
    }
  };

  const downloadTrip = (trip) => {
    const content = `Saved Travel Itinerary

Destination: ${trip.destination}
Days: ${trip.days}
Budget: ${trip.budget}
Travelers: ${trip.travelers}
Interests: ${trip.interests}

${trip.itinerary}`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${trip.destination || "saved"}-itinerary.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const toggleFavorite = (e, trip) => {
    e.stopPropagation();

    const updatedTrips = savedTrips.map((item) => {
      if (item === trip) {
        return {
          ...item,
          isFavorite: !item.isFavorite,
        };
      }

      return item;
    });

    setSavedTrips(updatedTrips);
    localStorage.setItem("savedItineraries", JSON.stringify(updatedTrips));

    if (selectedTrip === trip) {
      const updatedSelected = updatedTrips.find(
        (item) => item.createdAt === trip.createdAt
      );

      setSelectedTrip(updatedSelected);
    }
  };

  return (
    <>
      <section className="saved__page">
        <Container>
          <BackButton />

          <div className="saved__header">
            <h1>Saved Trips</h1>
            <p>All your AI generated itineraries in one place.</p>
          </div>

          {savedTrips.length === 0 ? (
            <div className="saved__empty">
              <h3>No saved itineraries yet.</h3>
              <p>Generate an AI trip and click Save to see it here.</p>
            </div>
          ) : (
            <Row>
              <Col lg="6">
                <Row>
                  {savedTrips.map((trip, index) => (
                    <Col md="6" className="mb-4" key={index}>
                      <motion.div
                        className={`saved__card ${
                          selectedTrip === trip ? "active" : ""
                        }`}
                        onClick={() => setSelectedTrip(trip)}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.35 }}
                        viewport={{ once: true }}
                      >
                        <div className="saved__img">
                          <img
                            src={getTripImage(trip.destination)}
                            alt={trip.destination}
                          />

                          <button
                            className={`saved__heart ${
                              trip.isFavorite ? "active__heart" : ""
                            }`}
                            onClick={(e) => toggleFavorite(e, trip)}
                          >
                            <i
                              className={
                                trip.isFavorite
                                  ? "ri-heart-fill"
                                  : "ri-heart-line"
                              }
                            ></i>
                          </button>

                          <span>Saved</span>
                        </div>

                        <div className="saved__card-body">
                          <div className="saved__location">
                            <i className="ri-map-pin-line"></i>
                            <h5>{trip.destination}</h5>
                            <i className="ri-star-fill star"></i>
                          </div>

                          <p>
                            {trip.days} days • {trip.budget} • {trip.travelers}{" "}
                            travelers
                          </p>
                        </div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>

              <Col lg="6">
                <AnimatePresence mode="wait">
                  {selectedTrip && (
                    <motion.div
                      key={selectedTrip.destination + selectedTrip.createdAt}
                      className="trip__details"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.35 }}
                    >
                      <button
                        className="back__btn"
                        onClick={() => setSelectedTrip(null)}
                      >
                        <i className="ri-arrow-left-line"></i>
                        Back to all trips
                      </button>

                      <h2>{selectedTrip.destination}</h2>

                      <p className="trip__meta">
                        {selectedTrip.days} days • {selectedTrip.budget} •{" "}
                        {selectedTrip.travelers} travelers
                      </p>

                      <div className="trip__actions">
                        <Button color="dark" onClick={() => downloadTrip(selectedTrip)}>
                          <i className="ri-download-line"></i> Download
                        </Button>

                        <Button color="danger" onClick={() => deleteTrip(selectedTrip)}>
                          <i className="ri-delete-bin-line"></i> Delete
                        </Button>
                      </div>

                      <pre>{selectedTrip.itinerary}</pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default SavedItineraries;