import React from "react";

import CommonSection from "../Shared/CommonSection";
import TourCard from "../Shared/TourCard";
import Newsletter from "../Shared/Newsletter";

import { Container, Row, Col, Button } from "reactstrap";
import { useLocation, Link } from "react-router-dom";

import "../Shared/searchbar.css";

const SearchResultList = () => {
  const location = useLocation();

  const result = location.state?.searchResult || [];

  const searchResult = Array.isArray(result)
    ? result
    : result?.data || [];

  return (
    <>
      <CommonSection title="Search Results" />

      <section>
        <Container>
          <Row>
            {searchResult.length === 0 ? (
              <Col lg="12">
                <div className="no-results text-center">
                  <p>No search results found.</p>

                  <Link to="/tours">
                    <Button className="btn primary__btn">
                      Go to Tours
                    </Button>
                  </Link>
                </div>
              </Col>
            ) : (
              searchResult.map((tour) => (
                <Col
                  lg="3"
                  md="6"
                  sm="6"
                  className="mb-4"
                  key={tour._id}
                >
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default SearchResultList;