import express from "express";

import {
  createTour,
  deleteTour,
  getAllTour,
  getFeaturedTour,
  getSingleTour,
  getTourCount,
  updateTour,
} from "../controllers/tourController.js";

import verifyToken, {
  verifyAdmin,
} from "../utils/verifyToken.js";

const tourRoute = express.Router();

// Featured tours
tourRoute.get("/featured", getFeaturedTour);

// Tour count
tourRoute.get("/count", getTourCount);

// Get all tours
tourRoute.get("/", getAllTour);

// Get single tour
tourRoute.get("/:id", getSingleTour);

// Create tour
tourRoute.post("/", verifyToken, verifyAdmin, createTour);

// Update tour
tourRoute.put("/:id", verifyToken, verifyAdmin, updateTour);

// Delete tour
tourRoute.delete("/:id", verifyToken, verifyAdmin, deleteTour);

export default tourRoute;