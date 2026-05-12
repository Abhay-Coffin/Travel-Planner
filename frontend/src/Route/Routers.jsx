import React from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "../Pages/Home";
import Tours from "../Pages/Tours";
import TourDetails from "../Pages/TourDetails";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import SearchResultList from "../Pages/SearchResultList";
import ThankYou from "../Pages/ThankYou";
import About from "../Pages/About";
import FAQ from "../Shared/FAQ";
import Contact from "../Pages/Contact";
import Gallery from "../Pages/Gallery";
import PageNotFound from "../Pages/PageNotFound";
import Blogs from "../Pages/Blogs";
import BlogDetails from "../Pages/BlogDetails";
import Profile from "../Pages/Profile";
import Wishlist from "../Pages/Wishlist";

import ScrollToTop from "../utils/scrollToTop";
import AiPlanner from "../Pages/AiPlanner";
import SavedItineraries from "../Pages/SavedItineraries";

import AdminDashboard from "../Pages/AdminDashboard";
import AdminTours from "../Pages/AdminTours";
import AdminBlogs from "../Pages/AdminBlogs";
import AdminBookings from "../Pages/AdminBookings";
import MyBookings from "../Pages/MyBookings";

import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 25,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -25,
  },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
};

const Routers = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />

          <Route
            path="/about"
            element={
              <PageWrapper>
                <About />
              </PageWrapper>
            }
          />

          <Route
            path="/tours"
            element={
              <PageWrapper>
                <Tours />
              </PageWrapper>
            }
          />

          <Route
            path="/tours/:id"
            element={
              <PageWrapper>
                <TourDetails />
              </PageWrapper>
            }
          />

          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />

          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />

          <Route
            path="/thank-you"
            element={
              <PageWrapper>
                <ThankYou />
              </PageWrapper>
            }
          />

          <Route
            path="/search"
            element={
              <PageWrapper>
                <SearchResultList />
              </PageWrapper>
            }
          />

          <Route
            path="/faq"
            element={
              <PageWrapper>
                <FAQ />
              </PageWrapper>
            }
          />

          <Route
            path="/gallery"
            element={
              <PageWrapper>
                <Gallery />
              </PageWrapper>
            }
          />

          <Route
            path="/contact"
            element={
              <PageWrapper>
                <Contact />
              </PageWrapper>
            }
          />

          <Route
            path="/blogs"
            element={
              <PageWrapper>
                <Blogs />
              </PageWrapper>
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <PageWrapper>
                <BlogDetails />
              </PageWrapper>
            }
          />

          <Route
            path="/profile"
            element={
              <PageWrapper>
                <Profile />
              </PageWrapper>
            }
          />

          <Route
            path="/wishlist"
            element={
              <PageWrapper>
                <Wishlist />
              </PageWrapper>
            }
          />

          <Route
            path="/ai-planner"
            element={
              <PageWrapper>
                <AiPlanner />
              </PageWrapper>
            }
          />

          <Route
            path="/saved-itineraries"
            element={
              <PageWrapper>
                <SavedItineraries />
              </PageWrapper>
            }
          />

          <Route
            path="/admin"
            element={
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            }
          />

          <Route
            path="/admin/tours"
            element={
              <PageWrapper>
                <AdminTours />
              </PageWrapper>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <PageWrapper>
                <AdminBlogs />
              </PageWrapper>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <PageWrapper>
                <AdminBookings />
              </PageWrapper>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <PageWrapper>
                <MyBookings />
              </PageWrapper>
            }
          />

          <Route
            path="*"
            element={
              <PageWrapper>
                <PageNotFound />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default Routers;