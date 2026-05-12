import express from "express";

import { generateItinerary } from "../controllers/aiController.js";

const aiRoute = express.Router();

aiRoute.post("/itinerary", generateItinerary);

export default aiRoute;