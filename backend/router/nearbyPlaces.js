import express from "express";
import { getNearbyPlaces } from "../controllers/nearbyPlacesController.js";

const nearbyPlacesRoute = express.Router();

nearbyPlacesRoute.get("/", getNearbyPlaces);

export default nearbyPlacesRoute;