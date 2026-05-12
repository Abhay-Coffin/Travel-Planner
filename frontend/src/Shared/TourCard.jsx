import React, { useContext } from "react";
import "./Tourcard.css";

import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { WishlistContext } from "../context/WishlistContext.jsx";

const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, featured, avgRating } = tour;

  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const liked = isWishlisted(_id);

  return (
    <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
      <Card className="tour__card premium__tour-card">
        <div className="tour__img">
          <img src={photo} alt={title} />

          {featured && <span className="featured__badge">Featured</span>}

          <motion.div
            className="wishlist__icon"
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleWishlist(tour)}
          >
            {liked ? <FaHeart color="#ff4d6d" /> : <FaRegHeart />}
          </motion.div>
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {city}
            </span>

            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>
              {avgRating === 0 ? "Not Rated" : avgRating}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id}`}>{title}</Link>
          </h5>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ₹{price}
              <span>/ per person</span>
            </h5>

            <button className="booking__btn">
              <Link to={`/tours/${_id}`}>Book Now</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default TourCard;