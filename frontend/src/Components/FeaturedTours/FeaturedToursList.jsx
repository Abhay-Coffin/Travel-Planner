import React from "react";

import { Button, Col } from "reactstrap";
import { NavLink } from "react-router-dom";

import TourCard from "../../Shared/TourCard";
import useFetch from "../../hooks/useFetch";

const FeaturedToursList = () => {
  const { data: featuredTours, loading } = useFetch("tours/featured");

  const tours = Array.isArray(featuredTours)
    ? featuredTours
    : featuredTours?.data || [];

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {tours.map((tour) => (
        <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
          <TourCard tour={tour} />
        </Col>
      ))}

      <div className="view__btn">
        <NavLink to="/tours">
          <Button className="btn primary__btn">
            View All Tours
          </Button>
        </NavLink>
      </div>
    </>
  );
};

export default FeaturedToursList;