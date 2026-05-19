import express from "express";
import { convertCurrency } from "../controllers/currencyController.js";

const currencyRoute = express.Router();

currencyRoute.get("/convert", convertCurrency);

export default currencyRoute;