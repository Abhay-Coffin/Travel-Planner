import React, { useEffect, useState } from "react";
import { Container, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import CommonSection from "../Shared/CommonSection";
import BackButton from "../Components/common/BackButton";
import { BASE_URL } from "../utils/config";

import "../styles/AiPlanner.css";

const PublicItinerary = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/itineraries/public/${shareId}`
        );

        setTrip(response.data?.data || null);
      } catch (error) {
        console.error(error);
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTrip();
  }, [shareId]);

  return (
    <>
      <CommonSection title="Shared Travel Itinerary" />

      <section className="ai__planner">
        <Container>
          <BackButton />

          {loading ? (
            <div className="ai__result">
              <h3>Loading shared itinerary...</h3>
            </div>
          ) : !trip ? (
            <div className="ai__result">
              <h3>Itinerary Not Found</h3>
              <p>This public itinerary link is invalid or expired.</p>

              <Button
                className="btn primary__btn mt-3"
                onClick={() => navigate("/ai-planner")}
              >
                Create New Itinerary
              </Button>
            </div>
          ) : (
            <div className="ai__result">
              <div className="ai__result-header">
                <div>
                  <span className="ai__badge">Public Shared Trip</span>
                  <h3>{trip.destination} Travel Itinerary</h3>
                  <p>
                    {trip.days} days • {trip.travelers} travelers •{" "}
                    {trip.budget}
                  </p>
                </div>

                <Button
                  className="btn primary__btn"
                  onClick={() => navigate("/ai-planner")}
                >
                  Create My Trip
                </Button>
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
          )}
        </Container>
      </section>
    </>
  );
};

export default PublicItinerary;