import express from "express";

import {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  updateBookingStatusByAdmin,
  getBookingById,
} from "../controllers/bookingController.js";

import verifyToken, {
  verifyAdmin,
} from "../utils/verifyToken.js";

const bookingRoute = express.Router();

// Create booking
bookingRoute.post("/", verifyToken, createBooking);

// Get all bookings (admin only)
bookingRoute.get("/", verifyToken, verifyAdmin, getAllBookings);

// Get logged in user bookings
bookingRoute.get("/my-bookings", verifyToken, getUserBookings);

// Get single booking
bookingRoute.get("/:id", verifyToken, getBookingById);

// Cancel booking
bookingRoute.put("/cancel/:id", verifyToken, cancelBooking);

// Admin update booking
bookingRoute.put(
  "/admin/update/:id",
  verifyToken,
  verifyAdmin,
  updateBookingStatusByAdmin
);

export default bookingRoute;