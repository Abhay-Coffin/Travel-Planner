import express from "express";
import {
  createItinerary,
  getMyItineraries,
  getPublicItinerary,
  deleteItinerary,
} from "../controllers/itineraryController.js";

import { verifyUser } from "../utils/verifyToken.js";

const itineraryRoute = express.Router();

itineraryRoute.post("/", verifyUser, createItinerary);
itineraryRoute.get("/mine", verifyUser, getMyItineraries);
itineraryRoute.get("/public/:shareId", getPublicItinerary);
itineraryRoute.delete("/:id", verifyUser, deleteItinerary);

export default itineraryRoute;