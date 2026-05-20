import express from "express";
import {
  createItinerary,
  getMyItineraries,
  getPublicItinerary,
  deleteItinerary,
  getAllItinerariesForAdmin,
  deleteItineraryByAdmin,
} from "../controllers/itineraryController.js";

import verifyToken, { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const itineraryRoute = express.Router();

itineraryRoute.post("/", verifyUser, createItinerary);
itineraryRoute.get("/mine", verifyUser, getMyItineraries);
itineraryRoute.get("/public/:shareId", getPublicItinerary);
itineraryRoute.get("/admin/all",verifyToken,verifyAdmin,getAllItinerariesForAdmin);
itineraryRoute.delete("/:id", verifyUser, deleteItinerary);
itineraryRoute.delete("/admin/:id",verifyToken,verifyAdmin,deleteItineraryByAdmin);

export default itineraryRoute;