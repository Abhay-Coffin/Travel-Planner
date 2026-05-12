import React from "react";
import { useNavigate } from "react-router-dom";

import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="global__back-btn" onClick={() => navigate(-1)}>
      <i className="ri-arrow-left-line"></i>
      Back
    </button>
  );
};

export default BackButton;