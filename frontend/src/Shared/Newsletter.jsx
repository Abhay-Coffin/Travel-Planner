import React, { useState } from "react";

import {
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";

import "./Newsletter.css";

const MaleTourist =
  "https://cdn-icons-png.flaticon.com/512/201/201623.png";
const Newsletter = () => {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setMessage(
      "Subscribed successfully!"
    );

    setEmail("");
  };

  return (
    <section className="newsletter">
      <Container>
        <Row className="align-items-center">
          <Col lg="6">
            <div className="newsletter__content">
              <h2>
                Subscribe to get Useful
                Traveling Information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="newsletter__input">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                  <button
                    type="submit"
                    className="btn newsletter__btn"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              {message && (
                <Alert color="success">
                  {message}
                </Alert>
              )}

              {error && (
                <Alert color="danger">
                  {error}
                </Alert>
              )}

              <p>
                Discover amazing destinations,
                travel tips, tour packages, and
                exclusive offers directly in
                your inbox.
              </p>
            </div>
          </Col>

          <Col lg="6">
            <div className="newsletter__img">
              <img
                src={MaleTourist}
                alt="Traveler"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;