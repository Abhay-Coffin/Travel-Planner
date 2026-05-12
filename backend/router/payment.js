import express from "express";

import {
  createPaymentOrder,
  verifyPaymentAndCreateBooking,
} from "../controllers/paymentController.js";

const paymentRoute = express.Router();

paymentRoute.post("/create-order", createPaymentOrder);
paymentRoute.post("/verify", verifyPaymentAndCreateBooking);

export default paymentRoute;