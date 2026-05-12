import express from "express";
import { getTourBySearch } from "../controllers/searchController.js";

const searchRoute = express.Router();

// Route for searching tours
searchRoute.get("/", getTourBySearch);

export default searchRoute;