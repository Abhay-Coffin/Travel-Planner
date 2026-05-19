import React, { useEffect, useState } from "react";
import { Container, Button } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";

import CommonSection from "../Shared/CommonSection";
import BackButton from "../Components/common/BackButton";

import "../styles/AiPlanner.css";

const SharedItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("sharedItineraries")) || [];
    const foundTrip = trips.find((item) => item.id === id);
    setTrip(foundTrip || null);
  }, [id]);

  if (!trip) {
    return (
      <>
        <CommonSection title="Shared Itinerary" />
        <section className="ai__planner">
          <Container>
            <BackButton />
            <div className="ai__result">
              <h3>Itinerary Not Found</h3>
              <p>This shared itinerary is not available on this browser.</p>
              <Button
                className="btn primary__btn mt-3"
                onClick={() => navigate("/ai-planner")}
              >
                Create New Itinerary
              </Button>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <CommonSection title="Shared Travel Itinerary" />

      <section className="ai__planner">
        <Container>
          <BackButton />

          <div className="ai__result">
            <div className="ai__result-header">
              <div>
                <span className="ai__badge">Shared Trip Plan</span>
                <h3>{trip.destination} Travel Itinerary</h3>
                <p>
                  {trip.days} days • {trip.travelers} travelers • {trip.budget}
                </p>
              </div>
            </div>

            <div className="currency__summary mb-4">
              <h5>Trip Details</h5>

              <div className="summary__grid">
                <div>
                  <span>Destination</span>
                  <strong>{trip.destination}</strong>
                </div>

                <div>
                  <span>Budget</span>
                  <strong>{trip.budget}</strong>
                </div>

                <div>
                  <span>Interests</span>
                  <strong>{trip.interests}</strong>
                </div>
              </div>
            </div>

            <pre>{trip.itinerary}</pre>
          </div>
        </Container>
      </section>
    </>
  );
};

export default SharedItinerary;