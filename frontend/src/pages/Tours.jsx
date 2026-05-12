import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";

import CommonSection from "../Shared/CommonSection";
import SearchBar from "../Shared/SearchBar";
import TourCard from "../Shared/TourCard";
import Newsletter from "../Shared/Newsletter";
import Loader from "../Components/Loader/Loader";
import BackButton from "../Components/Common/BackButton";

import useFetch from "../hooks/useFetch";

import "../styles/Tour.css";

const categories = ["All Tours", "Adventure", "Beach", "Cultural", "Honeymoon", "Wildlife"];

const Tours = () => {
  const { data: tours, loading, error } = useFetch("tours");
  const [activeCategory, setActiveCategory] = useState("All Tours");

  if (loading) return <Loader />;

  if (error) {
    return <h4 className="text-center pt-5">Something went wrong.</h4>;
  }

  return (
    <>
      <CommonSection
        title="All Tours"
        subtitle="Find the perfect tour for your next adventure. Explore our handpicked experiences around the world."
        type="tours"
      >
        <div className="premium__search-box">
          <SearchBar />
        </div>
      </CommonSection>

      <section className="premium__page-section">
        <Container>
          <BackButton />

          <div className="page__toolbar">
            <div className="category__tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={activeCategory === cat ? "active" : ""}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select className="sort__select">
              <option>Sort by: Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>

          <Row>
            {Array.isArray(tours) && tours.length > 0 ? (
              tours.map((tour, index) => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                </Col>
              ))
            ) : (
              <Col lg="12">
                <h4 className="text-center">No tours found.</h4>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default Tours;