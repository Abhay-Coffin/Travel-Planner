import express from "express";

import {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const bookingRoute = express.Router();

bookingRoute.post("/", createBooking);

bookingRoute.get("/", getAllBookings);

bookingRoute.get("/user/:email", getUserBookings);

bookingRoute.put("/cancel/:id", cancelBooking);

export default bookingRoute;