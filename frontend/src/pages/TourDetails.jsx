import React, { useState, useContext, useRef } from "react";

import "../styles/Tourdetails.css";

import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import calculateAvgRating from "../utils/avgRating";

import avatar from "../assets/images/avatar.jpg";

import Booking from "../Components/Booking/Booking";
import Newsletter from "../Shared/Newsletter";
import WeatherCard from "../Components/WeatherCard/WeatherCard";
import TourMap from "../Components/TourMap/TourMap";
import BackButton from "../Components/Common/BackButton";

import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";

import { AuthContext } from "../context/AuthContext";

const TourDetails = () => {
  const { id } = useParams();

  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(0);

  const { user } = useContext(AuthContext);

  const {
    data: tour,
    loading,
    error,
  } = useFetch(`tours/${id}`);

  const {
    photo,
    title,
    desc,
    price,
    reviews = [],
    city,
    address,
    distance,
    maxGroupSize,
  } = tour || {};

  const { totalRating, avgRating } = calculateAvgRating(reviews || []);

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating = 0) => {
    const safeRating = Number(rating) || 0;

    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={index < safeRating ? "ri-star-fill" : "ri-star-line"}
      ></i>
    ));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const reviewText = reviewMsgRef.current.value.trim();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!tourRating) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText) {
      toast.error("Please write your review");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: user.username || user.fullName || "User",
          reviewText,
          rating: tourRating,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to submit review");
        return;
      }

      toast.success("Review submitted successfully");

      setTourRating(0);
      reviewMsgRef.current.value = "";
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <section>
        <Container>
          <BackButton />

          {loading && <h4 className="text-center pt-5">Loading...</h4>}

          {error && <h4 className="text-center pt-5">{error}</h4>}

          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <img src={photo} alt={title} />

                  <div className="tour__info">
                    <h2>{title}</h2>

                    <div className="tour__meta d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "var(--secondary-color)" }}
                        ></i>

                        {avgRating === 0 ? "Not rated" : avgRating}

                        {totalRating !== 0 && <span>({reviews?.length})</span>}
                      </span>

                      <span>
                        <i className="ri-map-pin-user-fill"></i>
                        {address || "Address not available"}
                      </span>
                    </div>

                    <div className="tour__extra-details">
                      <span>
                        <i className="ri-map-pin-2-line"></i>
                        {city || "N/A"}
                      </span>

                      <span>
                        <i className="ri-money-rupee-circle-line"></i>₹
                        {price || 0} /per person
                      </span>

                      <span>
                        <i className="ri-map-pin-time-line"></i>
                        {distance || 0} km
                      </span>

                      <span>
                        <i className="ri-group-line"></i>
                        {maxGroupSize || 1} people
                      </span>
                    </div>

                    <h5>Description</h5>

                    <p>{desc || "No description available."}</p>

                    <WeatherCard city={address || city} />

                    <TourMap city={address || city} title={title} />
                  </div>

                  <div className="tour__reviews mt-4">
                    <div className="reviews__header">
                      <div>
                        <h4>Traveler Reviews</h4>
                        <p>{reviews?.length || 0} reviews for this tour</p>
                      </div>

                      <div className="reviews__summary">
                        <i className="ri-star-fill"></i>
                        <span>{avgRating === 0 ? "New" : avgRating}</span>
                      </div>
                    </div>

                    <Form onSubmit={submitHandler} className="review__form">
                      <h5>Rate your experience</h5>

                      <div className="rating__group">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <button
                            type="button"
                            key={item}
                            className={tourRating >= item ? "active" : ""}
                            onClick={() => setTourRating(item)}
                          >
                            <i className="ri-star-fill"></i>
                          </button>
                        ))}
                      </div>

                      <FormGroup>
                        <div className="review__input">
                          <input
                            type="text"
                            ref={reviewMsgRef}
                            placeholder="Share your thoughts about this tour..."
                            required
                          />

                          <Button
                            className="btn primary__btn text-white"
                            type="submit"
                          >
                            Submit
                          </Button>
                        </div>
                      </FormGroup>
                    </Form>

                    <ListGroup className="user__reviews">
                      {reviews && reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <ListGroupItem key={review._id || index}>
                            <div className="review__item">
                              <img
                                src={review.photo || avatar}
                                alt={review.username || "User"}
                                onError={(e) => {
                                  e.currentTarget.src = avatar;
                                }}
                              />

                              <div className="review__content">
                                <div className="review__top">
                                  <div>
                                    <h5>
                                      {review.username ||
                                        review.user?.username ||
                                        "Anonymous User"}
                                    </h5>

                                    <p>{formatDate(review.createdAt)}</p>
                                  </div>

                                  <span className="review__stars">
                                    {renderStars(review.rating)}
                                  </span>
                                </div>

                                <h6>
                                  {review.reviewText ||
                                    "No review text provided."}
                                </h6>
                              </div>
                            </div>
                          </ListGroupItem>
                        ))
                      ) : (
                        <div className="empty__reviews">
                          <i className="ri-chat-smile-2-line"></i>
                          <h5>No reviews yet</h5>
                          <p>Be the first traveler to review this tour.</p>
                        </div>
                      )}
                    </ListGroup>
                  </div>
                </div>
              </Col>

              <Col lg="4">
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default TourDetails;