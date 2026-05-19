import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchResultList from "../pages/SearchResultList";
import ThankYou from "../pages/ThankYou";
import About from "../pages/About";
import FAQ from "../Shared/FAQ";
import Contact from "../pages/Contact";
import Gallery from "../pages/Gallery";
import PageNotFound from "../pages/PageNotFound";
import Blogs from "../pages/Blogs";
import BlogDetails from "../pages/BlogDetails";
import Profile from "../pages/Profile";
import Wishlist from "../pages/Wishlist";

import ScrollToTop from "../utils/scrollToTop";
import AiPlanner from "../pages/AiPlanner";
import SavedItineraries from "../pages/SavedItineraries";
import SharedItinerary from "../pages/SharedItinerary";
import PublicItinerary from "../pages/PublicItinerary";

import AdminDashboard from "../pages/AdminDashboard";
import AdminTours from "../pages/AdminTours";
import AdminBlogs from "../pages/AdminBlogs";
import AdminBookings from "../pages/AdminBookings";
import MyBookings from "../pages/MyBookings";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

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
          <Route path="/shared/:shareId" element={<PageWrapper><PublicItinerary /></PageWrapper>} />

          <Route
  path="/share-itinerary/:id"
  element={
    <PageWrapper>
      <SharedItinerary />
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