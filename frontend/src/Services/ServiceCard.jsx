import React from "react";
import { motion } from "framer-motion";

import "./Servicecard.css";

const ServiceCard = ({ item }) => {
  const { imgUrl, title, desc } = item || {};

  return (
    <motion.div
      className="service__item"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="service__img">
        <img src={imgUrl} alt={title || "service"} />
      </div>

      <h5>{title}</h5>

      <p>{desc}</p>
    </motion.div>
  );
};

export default ServiceCard;