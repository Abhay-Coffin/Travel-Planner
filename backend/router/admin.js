import express from "express";

import verifyToken, { verifyAdmin } from "../utils/verifyToken.js";
import { getAdminStats } from "../controllers/adminController.js";

const adminRoute = express.Router();

adminRoute.get("/stats", verifyToken, verifyAdmin, getAdminStats);

export default adminRoute;