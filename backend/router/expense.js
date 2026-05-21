import express from "express";

import verifyToken from "../utils/verifyToken.js";

import {
  predictExpenses,
} from "../controllers/expenseController.js";

const router = express.Router();

router.post(
  "/predict",
  verifyToken,
  predictExpenses
);

export default router;