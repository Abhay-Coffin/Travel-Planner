import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ScrollToTop from "../utils/scrollToTop";

const Home = lazy(() => import("../pages/Home"));
const Tours = lazy(() => import("../pages/Tours"));
const TourDetails = lazy(() => import("../pages/TourDetails"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const SearchResultList = lazy(() => import("../pages/SearchResultList"));
const ThankYou = lazy(() => import("../pages/ThankYou"));
const About = lazy(() => import("../pages/About"));
const FAQ = lazy(() => import("../Shared/FAQ"));
const Contact = lazy(() => import("../pages/Contact"));
const Gallery = lazy(() => import("../pages/Gallery"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const Blogs = lazy(() => import("../pages/Blogs"));
const BlogDetails = lazy(() => import("../pages/BlogDetails"));
const Profile = lazy(() => import("../pages/Profile"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const AiPlanner = lazy(() => import("../pages/AiPlanner"));
const SavedItineraries = lazy(() => import("../pages/SavedItineraries"));
const PublicItinerary = lazy(() => import("../pages/PublicItinerary"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminTours = lazy(() => import("../pages/AdminTours"));
const AdminBlogs = lazy(() => import("../pages/AdminBlogs"));
const AdminBookings = lazy(() => import("../pages/AdminBookings"));
const AdminItineraries = lazy(() => import("../pages/AdminItineraries"));
const MyBookings = lazy(() => import("../pages/MyBookings"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

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

      <Suspense fallback={<div className="page__loader">Loading page...</div>}>
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
              path="/shared/:shareId"
              element={
                <PageWrapper>
                  <PublicItinerary />
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
              path="/admin/itineraries"
              element={
                <PageWrapper>
                  <AdminItineraries />
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
      </Suspense>
    </>
  );
};

export default Routers;