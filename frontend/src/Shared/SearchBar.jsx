import React, { useRef } from "react";
import "./searchbar.css";

import { Col, Form, FormGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import axios from "axios";
import { BASE_URL } from "../utils/config";

const SearchBar = () => {
  const locationRef = useRef("");
  const distanceRef = useRef("");
  const maxGroupSizeRef = useRef("");

  const navigate = useNavigate();

  const searchHandler = async (e) => {
    e.preventDefault();

    const location = locationRef.current.value.trim();
    const distance = distanceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    const searchParams = new URLSearchParams();

    if (location) searchParams.append("city", location);
    if (distance) searchParams.append("distance", distance);
    if (maxGroupSize) searchParams.append("maxGroupSize", maxGroupSize);

    if (!location && !distance && !maxGroupSize) {
      toast.error("Please enter at least one search field.");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/search?${searchParams.toString()}`
      );

      navigate(`/search?${searchParams.toString()}`, {
        state: {
          searchResult: response.data?.data || response.data || [],
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch search results."
      );
    }
  };

  return (
    <Col lg="12" className="search__col">
      <motion.div
        className="search__bar"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true }}
      >
        <Form className="search__form" onSubmit={searchHandler}>
          <FormGroup className="form__group form__group-first">
            <span>
              <i className="ri-map-pin-line" />
            </span>

            <div className="search__field">
              <h6>Location</h6>

              <input
                type="text"
                placeholder="Where are you going?"
                ref={locationRef}
              />
            </div>
          </FormGroup>

          <FormGroup className="form__group form__group-first">
            <span>
              <i className="ri-map-pin-time-line" />
            </span>

            <div className="search__field">
              <h6>Distance</h6>

              <input
                type="number"
                min="0"
                placeholder="Distance km"
                ref={distanceRef}
              />
            </div>
          </FormGroup>

          <FormGroup className="form__group">
            <span>
              <i className="ri-group-line" />
            </span>

            <div className="search__field">
              <h6>Max People</h6>

              <input
                type="number"
                min="1"
                placeholder="0"
                ref={maxGroupSizeRef}
              />
            </div>
          </FormGroup>

          <motion.button
            className="search__icon"
            type="submit"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="ri-search-line" />
          </motion.button>
        </Form>
      </motion.div>
    </Col>
  );
};

export default SearchBar;