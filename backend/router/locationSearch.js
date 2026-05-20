import express from "express";
import { searchLocations } from "../controllers/locationSearchController.js";

const locationSearchRoute = express.Router();

locationSearchRoute.get("/search", searchLocations);

export default locationSearchRoute;