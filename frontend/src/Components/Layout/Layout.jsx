import React from "react";

import Header from "../Header/Header";
import Router from "../../Route/Routers.jsx";
import Footer from "../Footer/Footer";

import ScrollProgress from "../ScrollProgress/ScrollProgress";
import BackToTop from "../BackToTop/BackToTop";

import Chatbot from "../Chatbot/Chatbot";

const Layout = () => {
  return (
    <>
      <ScrollProgress />

      <Header />

      <Router />

      <Footer />

      <BackToTop />

      <Chatbot />
    </>
  );
};

export default Layout;