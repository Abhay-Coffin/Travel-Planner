import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

import BackButton from "../Components/common/BackButton";
import { BASE_URL } from "../utils/config";

import "../styles/AdminDashboard.css";

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      user?.token ||
      user?.data?.token ||
      user?.accessToken ||
      user?.data?.accessToken ||
      localStorage.getItem("token")
    );
  } catch {
    return localStorage.getItem("token");
  }
};

const AdminItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItineraries = async () => {
    try {
      const token = getToken();

      const res = await axios.get(`${BASE_URL}/itineraries/admin/all`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const trips = res.data?.data || [];

      setItineraries(trips);
      setSelectedTrip(trips[0] || null);
    } catch (error) {
      console.error("ADMIN ITINERARIES ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to load itineraries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const deleteItinerary = async (id) => {
    try {
      const token = getToken();

      await axios.delete(`${BASE_URL}/itineraries/admin/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTrips = itineraries.filter((item) => item._id !== id);

      setItineraries(updatedTrips);
      setSelectedTrip(updatedTrips[0] || null);

      toast.success("Itinerary deleted!");
    } catch (error) {
      console.error("DELETE ITINERARY ERROR:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const copyShareLink = async (trip) => {
    if (!trip.shareId) {
      toast.info("This itinerary is private.");
      return;
    }

    const link = `${window.location.origin}/shared/${trip.shareId}`;

    await navigator.clipboard.writeText(link);
    toast.success("Public link copied!");
  };

  return (
    <section className="admin__dashboard">
      <Container>
        <BackButton />

        <div className="admin__header">
          <h1>AI Itinerary Management</h1>
          <p>View, monitor, share, and remove AI-generated trip plans.</p>
        </div>

        {loading ? (
          <div className="admin__loading">Loading itineraries...</div>
        ) : itineraries.length === 0 ? (
          <div className="admin__loading">No AI itineraries found.</div>
        ) : (
          <Row>
            <Col lg="5" className="mb-4">
              <div className="admin__recent-box">
                <h4>All Itineraries</h4>

                {itineraries.map((trip) => (
                  <div
                    className={`admin__itinerary-item ${
                      selectedTrip?._id === trip._id ? "active" : ""
                    }`}
                    key={trip._id}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <strong>{trip.destination}</strong>

                    <span>
                      {trip.days} days • {trip.budget} •{" "}
                      {trip.isPublic ? "Public" : "Private"}
                    </span>

                    <small>
                      User: {trip.userId?.username || trip.userId?.email || "Guest"}
                    </small>
                  </div>
                ))}
              </div>
            </Col>

            <Col lg="7" className="mb-4">
              {selectedTrip && (
                <div className="admin__recent-box">
                  <div className="admin__header-row">
                    <div>
                      <h4>{selectedTrip.destination}</h4>
                      <p>
                        {selectedTrip.days} days • {selectedTrip.travelers} travelers •{" "}
                        {selectedTrip.budget}
                      </p>
                    </div>

                    <span
                      className={`admin__status ${
                        selectedTrip.isPublic ? "public" : "private"
                      }`}
                    >
                      {selectedTrip.isPublic ? "Public" : "Private"}
                    </span>
                  </div>

                  <div className="trip__actions mb-3">
                    {selectedTrip.isPublic && (
                      <Button
                        color="warning"
                        onClick={() => copyShareLink(selectedTrip)}
                      >
                        <i className="ri-share-line"></i> Copy Share Link
                      </Button>
                    )}

                    <Button
                      color="danger"
                      onClick={() => deleteItinerary(selectedTrip._id)}
                    >
                      <i className="ri-delete-bin-line"></i> Delete
                    </Button>
                  </div>

                  <div className="currency__summary mb-4">
                    <h5>Trip Details</h5>

                    <div className="summary__grid">
                      <div>
                        <span>Country</span>
                        <strong>{selectedTrip.country || "N/A"}</strong>
                      </div>

                      <div>
                        <span>State</span>
                        <strong>{selectedTrip.state || "N/A"}</strong>
                      </div>

                      <div>
                        <span>Interests</span>
                        <strong>{selectedTrip.interests}</strong>
                      </div>
                    </div>
                  </div>

                  <pre>{selectedTrip.itinerary}</pre>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default AdminItineraries;