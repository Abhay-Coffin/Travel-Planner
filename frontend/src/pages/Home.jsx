import React from "react";
import { motion } from "framer-motion";

import "../styles/Home.css";

import { Container, Row, Col } from "reactstrap";

import Subtitle from "../Shared/Subtitle";
import SearchBar from "../Shared/SearchBar";
import Newsletter from "../Shared/Newsletter";

import ServiceList from "../Services/ServiceList";
import FeaturedToursList from "../Components/FeaturedTours/FeaturedToursList";
import MasonryImagesGallery from "../Components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../Components/Testimonials/testimonials";
import FeaturedBlogsList from "../Components/FeaturedBlogs/FeaturedBlogsList";
import NebulaBackground from "../Components/AnimatedBackground/NebulaBackground";

import Contact from "./Contact";

const worldImg =
  "https://cdn-icons-png.flaticon.com/512/814/814513.png";

const experienceImage =
  "https://cdn-icons-png.flaticon.com/512/201/201623.png";

const Home = () => {
  return (
    <>
      <section className="hero__section premium__home-hero">
        <NebulaBackground />

        <Container className="hero__container">
          <Row className="align-items-center">
            <Col lg="6">
              <motion.div
                className="hero__content"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="hero__subtitle d-flex align-items-center gap-3">
                  <Subtitle subtitle="Know Before You Go" />

                  <img src={worldImg} alt="World" />
                </div>

                <h1>
                  Traveling Opens The Door To Creating{" "}
                  <span className="highlight">Memories</span>
                </h1>

                <p>
                  Explore beautiful destinations, discover amazing tours, and
                  plan unforgettable travel experiences with Travel World.
                </p>

                <div className="hero__actions">
                  <a href="/tours" className="hero__primary-btn">
                    Explore Tours
                  </a>

                  <a href="/ai-planner" className="hero__secondary-btn">
                    AI Planner
                  </a>
                </div>
              </motion.div>
            </Col>

            <Col lg="6">
              <motion.div
                className="hero__nebula-card"
                initial={{ opacity: 0, scale: 0.9, x: 60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="nebula__glass-card">
                  <h3>AI Powered Trip Planning</h3>

                  <p>
                    Generate smart itineraries, explore tours, check weather and
                    book your journey from one place.
                  </p>

                  <div className="nebula__stats">
                    <div>
                      <span>12k+</span>
                      <p>Trips</p>
                    </div>

                    <div>
                      <span>50+</span>
                      <p>Places</p>
                    </div>

                    <div>
                      <span>24/7</span>
                      <p>Support</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>

            <Col lg="12">
              <motion.div
                className="hero__search-wrapper"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <SearchBar />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="ai__features-section">
        <Container>
          <Row className="mb-5">
            <Col lg="12">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Subtitle subtitle="Why Choose Our AI Planner" />

                <h2 className="ai__features-title">
                  Smarter Travel Planning Powered By AI
                </h2>

                <p className="ai__features-desc">
                  Generate intelligent itineraries with live weather,
                  interactive maps, budget analytics, nearby attractions,
                  packing suggestions, and shareable travel plans.
                </p>
              </motion.div>
            </Col>
          </Row>

          <Row>
            {[
              {
                icon: "ri-robot-2-line",
                title: "AI Trip Generation",
                desc: "Generate day-wise intelligent itineraries in seconds.",
              },
              {
                icon: "ri-map-pin-2-line",
                title: "Interactive Maps",
                desc: "Explore destinations with live maps and nearby places.",
              },
              {
                icon: "ri-cloudy-line",
                title: "Live Weather",
                desc: "Get real-time weather forecasts for your destination.",
              },
              {
                icon: "ri-funds-box-line",
                title: "Budget Analytics",
                desc: "Visualize travel expenses with smart cost estimation.",
              },
              {
                icon: "ri-share-forward-line",
                title: "Public Sharing",
                desc: "Share your AI-generated trips with a public link.",
              },
              {
                icon: "ri-shield-check-line",
                title: "Travel Safety",
                desc: "Receive destination safety and travel insights.",
              },
            ].map((feature, index) => (
              <Col lg="4" md="6" className="mb-4" key={index}>
                <motion.div
                  className="ai__feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35 }}
                  viewport={{ once: true }}
                >
                  <div className="ai__feature-icon">
                    <i className={feature.icon}></i>
                  </div>

                  <h4>{feature.title}</h4>

                  <p>{feature.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h5 className="services__subtitle">What We Serve</h5>

                <h2 className="services__title">
                  We Offer Our Best Services
                </h2>
              </motion.div>
            </Col>
          </Row>

          <ServiceList />
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Subtitle subtitle="Explore" />

                <h2 className="featured__tour-title">
                  Our Featured Tours
                </h2>
              </motion.div>
            </Col>

            <FeaturedToursList />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row className="align-items-center">
            <Col lg="6">
              <motion.div
                className="experience__content"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <Subtitle subtitle="Experience" />

                <h2>
                  With Our Experience <br />
                  We Will Serve You
                </h2>

                <p>
                  We help travelers discover the best destinations, plan smooth
                  trips, and create memorable experiences.
                </p>
              </motion.div>

              <motion.div
                className="counter__wrapper d-flex align-items-center gap-5"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Successful Trips</h6>
                </div>

                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Regular Clients</h6>
                </div>

                <div className="counter__box">
                  <span>15+</span>
                  <h6>Years Experience</h6>
                </div>
              </motion.div>
            </Col>

            <Col lg="6">
              <motion.div
                className="experience__img"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <img src={experienceImage} alt="Experience" />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Subtitle subtitle="Gallery" />

                <h2 className="gallery__title">
                  Visit Our Customers Tour Gallery
                </h2>
              </motion.div>
            </Col>

            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <motion.div
            className="blog__title"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Subtitle subtitle="Featured Blogs" />
          </motion.div>

          <Row>
            <FeaturedBlogsList lg={4} md={6} sm={6} />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Subtitle subtitle="Testimonial" />

                <h2 className="testimonials__title">
                  What Our Customers Say About Us
                </h2>
              </motion.div>
            </Col>

            <Testimonials />
          </Row>
        </Container>
      </section>

      <Contact />

      <Newsletter />
    </>
  );
};

export default Home;