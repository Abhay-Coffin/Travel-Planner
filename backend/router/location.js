import express from "express";
import { getCountryCurrency } from "../controllers/locationController.js";

const locationRoute = express.Router();

locationRoute.get("/currency", getCountryCurrency);

export default locationRoute;