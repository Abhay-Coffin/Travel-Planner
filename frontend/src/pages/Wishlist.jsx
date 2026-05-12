import React, { useContext } from "react";
import { Container, Row, Col } from "reactstrap";

import CommonSection from "../Shared/CommonSection";
import TourCard from "../Shared/TourCard";
import Newsletter from "../Shared/Newsletter";
import BackButton from "../Components/Common/BackButton";

import { WishlistContext } from "../context/WishlistContext.jsx";

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <>
      <CommonSection title="My Wishlist" />

      <section>
        <Container>
          <BackButton />

          <Row>
            {wishlist.length > 0 ? (
              wishlist.map((tour) => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            ) : (
              <Col lg="12">
                <div className="error__msg">
                  No saved tours yet. Click the heart icon on tours to save them.
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default Wishlist;