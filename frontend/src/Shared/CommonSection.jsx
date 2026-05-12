import React from "react";
import { Container } from "reactstrap";
import { motion } from "framer-motion";

import "./Commonsection.css";

const CommonSection = ({
  title,
  subtitle,
  type = "tours",
  children,
}) => {
  return (
    <section className={`common__section premium__hero ${type}`}>
      <Container>
        <motion.div
          className="premium__hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>{title}</h1>

          {subtitle && <p>{subtitle}</p>}

          {children}
        </motion.div>

        <motion.div
          className="plane__line"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          ✈
        </motion.div>
      </Container>
    </section>
  );
};

export default CommonSection;