import express from "express";

import {
  createReview,
  getTourReviews,
  deleteReview,
} from "../controllers/reviewController.js";

import verifyToken, { verifyUser } from "../utils/verifyToken.js";

const reviewRoute = express.Router();

// Create a new review for a tour
reviewRoute.post("/:tourId", createReview);

// Get all reviews for a tour
reviewRoute.get("/:tourId", getTourReviews);

// Delete a review
reviewRoute.delete("/:reviewId", verifyToken, verifyUser, deleteReview);

export default reviewRoute;