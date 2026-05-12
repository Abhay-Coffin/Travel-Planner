import React from "react";
import { motion } from "framer-motion";

import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader__wrapper">
      <motion.div
        className="loader__circle"
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      ></motion.div>

      <motion.h3
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1,
        }}
      >
        Exploring The World...
      </motion.h3>
    </div>
  );
};

export default Loader;