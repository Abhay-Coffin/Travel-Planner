import express from "express";
import { getWeatherByCity } from "../controllers/weatherController.js";

const weatherRoute = express.Router();

weatherRoute.get("/", getWeatherByCity);

export default weatherRoute;