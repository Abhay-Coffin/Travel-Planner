import express from "express";

import {
  createPaymentOrder,
  verifyPaymentAndCreateBooking,
} from "../controllers/paymentController.js";

import verifyToken from "../utils/verifyToken.js";

const paymentRoute = express.Router();

// Create Razorpay order
paymentRoute.post(
  "/create-order",
  verifyToken,
  createPaymentOrder
);

// Verify payment and create booking
paymentRoute.post(
  "/verify",
  verifyToken,
  verifyPaymentAndCreateBooking
);

export default paymentRoute;